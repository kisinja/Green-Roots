// app/api/admin/bulk-products/route.ts
import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { readExcelBuffer, parseProductRows, ExcelParseError } from "@/lib/bulk-import/excel";
import { extractImagesFromZip, uploadExtractedImages, ZipExtractionError } from "@/lib/bulk-import/images";
import { validateProductRows } from "@/lib/bulk-import/validator";
import { resolveCategories, importProducts } from "@/lib/bulk-import/importer";
import { buildImportReport } from "@/lib/bulk-import/report";
import { MAX_IMPORT_ROWS, type BulkImportProgressEvent } from "@/lib/bulk-import/types";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(req: NextRequest) {
  await requireAdmin();

  const formData = await req.formData();
  const excelFile = formData.get("products") as File | null;
  const zipFile = formData.get("images") as File | null;

  if (!excelFile) {
    return new Response(JSON.stringify({ error: "Missing products.xlsx file" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!zipFile) {
    return new Response(JSON.stringify({ error: "Missing images.zip file" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!excelFile.name.toLowerCase().endsWith(".xlsx")) {
    return new Response(
      JSON.stringify({ error: "products file must be a .xlsx file (CSV is not supported)" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const excelBuffer = Buffer.from(await excelFile.arrayBuffer());
  const zipBuffer = Buffer.from(await zipFile.arrayBuffer());

  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: BulkImportProgressEvent) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
      };

      const startedAt = new Date();

      try {
        // 1. Reading Excel
        send({ stage: "reading_excel", percent: 5, message: "Reading Excel..." });
        const rawRows = readExcelBuffer(excelBuffer);

        if (rawRows.length > MAX_IMPORT_ROWS) {
          throw new Error(
            `Sheet contains ${rawRows.length} rows, which exceeds the maximum of ${MAX_IMPORT_ROWS} per import`
          );
        }

        const parsedRows = parseProductRows(rawRows);

        // 2. Extracting ZIP
        send({ stage: "extracting_zip", percent: 15, message: "Extracting ZIP..." });
        const extractedImages = extractImagesFromZip(zipBuffer);
        const availableFilenames = new Set(extractedImages.keys());

        // 3. Validating
        send({ stage: "validating", percent: 25, message: "Validating rows..." });
        const { validRows, issues } = validateProductRows(
          parsedRows,
          new Set<string>(), // empty on purpose — see importer.ts notes on slug identity
          availableFilenames
        );

        // 4. Uploading Images
        send({ stage: "uploading_images", percent: 30, message: "Uploading Images..." });

        // Only upload images that are actually referenced by a valid row,
        // so a bad/unused file sitting in the zip never wastes a Cloudinary call.
        const neededFilenames = new Set<string>();
        for (const row of validRows) {
          for (const f of row.imageFilenames) neededFilenames.add(f.toLowerCase());
        }
        const imagesToUpload = new Map(
          Array.from(extractedImages.entries()).filter(([name]) => neededFilenames.has(name))
        );

        const { uploaded, failures } = await uploadExtractedImages(
          imagesToUpload,
          (completed, total) => {
            const pct = 30 + Math.floor((completed / Math.max(total, 1)) * 30); // 30 -> 60
            send({
              stage: "uploading_images",
              percent: pct,
              message: `Uploading Images... (${completed}/${total})`,
            });
          }
        );

        for (const failure of failures) {
          issues.push({
            rowNumber: 0,
            identifier: failure.filename,
            field: "images",
            message: `Failed to upload "${failure.filename}": ${failure.reason}`,
            severity: "error",
          });
        }

        // 5. Creating Categories
        send({ stage: "creating_categories", percent: 65, message: "Creating Categories..." });
        const categoryCache = await resolveCategories(prisma, validRows);

        // 6. Importing Products
        send({ stage: "importing_products", percent: 70, message: "Importing Products..." });
        const rowResults = await importProducts(
          prisma,
          validRows,
          categoryCache,
          uploaded,
          (completed, total) => {
            const pct = 70 + Math.floor((completed / Math.max(total, 1)) * 25); // 70 -> 95
            send({
              stage: "importing_products",
              percent: pct,
              message: `Importing Products... (${completed}/${total})`,
            });
          }
        );

        // 7. Finishing
        send({ stage: "finishing", percent: 97, message: "Finishing..." });
        const report = buildImportReport({
          totalRows: parsedRows.length,
          rowResults,
          validationIssues: issues,
          startedAt,
        });

        send({ stage: "done", percent: 100, message: "Import complete", report });
      } catch (err) {
        const message =
          err instanceof ExcelParseError || err instanceof ZipExtractionError
            ? err.message
            : err instanceof Error
              ? err.message
              : "Unexpected error during import";

        send({ stage: "error", percent: 100, message: "Import failed", error: message });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}