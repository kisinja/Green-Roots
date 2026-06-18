import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const workbook = XLSX.utils.book_new();

    const productsSheet = XLSX.utils.json_to_sheet([
        {
            name: "",
            category: "",
            price: "",
            stock: "",
            description: "",
            longDescription: "",
            featured: false,
            emoji: "🌱",
            badge: "",
            images: "image1.jpg,image2.jpg",
            features: "Feature 1;Feature 2",
        },
    ]);

    XLSX.utils.book_append_sheet(
        workbook,
        productsSheet,
        "Products"
    );

    const categories = await prisma.category.findMany({
        orderBy: {
            name: "asc",
        },
    });

    const categoriesSheet = XLSX.utils.json_to_sheet(
        categories.map((c) => ({
            category: c.name,
        }))
    );

    XLSX.utils.book_append_sheet(
        workbook,
        categoriesSheet,
        "Categories"
    );

    const buffer = XLSX.write(workbook, {
        type: "buffer",
        bookType: "xlsx",
    });

    return new NextResponse(buffer, {
        headers: {
            "Content-Type":
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "Content-Disposition":
                'attachment; filename="mkulima-supply-store-products-template.xlsx"',
        },
    });
}