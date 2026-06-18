import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import AdmZip from "adm-zip";
import slugify from "slugify";

import { prisma } from "@/lib/prisma";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();

        const excelFile = formData.get("excel") as File;
        const zipFile = formData.get("images") as File;

        if (!excelFile || !zipFile) {
            return NextResponse.json(
                { error: "Excel file and ZIP file are required" },
                { status: 400 }
            );
        }

        // Read Excel
        const excelBuffer = Buffer.from(await excelFile.arrayBuffer());

        const workbook = XLSX.read(excelBuffer, {
            type: "buffer",
        });

        const sheet = workbook.Sheets[workbook.SheetNames[0]];

        const rows = XLSX.utils.sheet_to_json<any>(sheet);

        // Extract ZIP
        const zipBuffer = Buffer.from(await zipFile.arrayBuffer());

        const zip = new AdmZip(zipBuffer);

        const zipEntries = zip.getEntries();

        const imageMap = new Map<string, Buffer>();

        zipEntries.forEach((entry:any) => {
            if (!entry.isDirectory) {
                imageMap.set(
                    entry.entryName.split("/").pop()!,
                    entry.getData()
                );
            }
        });

        const results = {
            imported: 0,
            failed: 0,
            errors: [] as string[],
        };

        for (const [index, row] of rows.entries()) {
            try {
                const categoryName = row.category?.trim();

                if (!categoryName) {
                    throw new Error("Missing category");
                }

                const category = await prisma.category.findUnique({
                    where: {
                        name: categoryName,
                    },
                });

                if (!category) {
                    throw new Error(
                        `Category "${categoryName}" does not exist`
                    );
                }

                const imageNames = String(row.images || "")
                    .split(",")
                    .map((i: string) => i.trim())
                    .filter(Boolean);

                const uploadedImages: string[] = [];

                for (const imageName of imageNames) {
                    const imageBuffer = imageMap.get(imageName);

                    if (!imageBuffer) {
                        throw new Error(
                            `Image not found in ZIP: ${imageName}`
                        );
                    }

                    const imageUrl = await uploadToCloudinary(
                        imageBuffer,
                        imageName
                    );

                    uploadedImages.push(imageUrl);
                }

                const slug = slugify(row.name, {
                    lower: true,
                    strict: true,
                });

                await prisma.product.create({
                    data: {
                        name: row.name,
                        slug,

                        description:
                            row.description || "",

                        longDescription:
                            row.longDescription || "",

                        price: Number(row.price),

                        stock: Number(row.stock || 0),

                        emoji: row.emoji || "🌱",

                        badge: row.badge || null,

                        featured:
                            String(row.featured).toLowerCase() ===
                            "true",

                        images: uploadedImages,

                        features: row.features
                            ? String(row.features)
                                .split(";")
                                .map((f: string) => f.trim())
                            : [],

                        categoryId: category.id,
                    },
                });

                results.imported++;
            } catch (error: any) {
                results.failed++;

                results.errors.push(
                    `Row ${index + 2}: ${error.message}`
                );
            }
        }

        return NextResponse.json(results);
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                error: "Bulk import failed",
            },
            {
                status: 500,
            }
        );
    }
}