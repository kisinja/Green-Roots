import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import QRCode from "qrcode";

interface GenerateReceiptOptions {
    order: any;
    receiptNumber: string;
}

export async function generateReceipt({
    order,
    receiptNumber,
}: GenerateReceiptOptions): Promise<Buffer> {
    const pdf = await PDFDocument.create();

    const page = pdf.addPage([595, 842]); // A4

    const font = await pdf.embedFont(StandardFonts.Helvetica);
    const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

    const { width, height } = page.getSize();

    let y = height - 50;

    // ==========================
    // HEADER
    // ==========================

    page.drawRectangle({
        x: 0,
        y: height - 80,
        width,
        height: 80,
        color: rgb(0.15, 0.55, 0.20),
    });

    page.drawText("Mkulima Supply Store", {
        x: 40,
        y: height - 45,
        font: bold,
        size: 24,
        color: rgb(1, 1, 1),
    });

    y -= 70;

    page.drawText("PAYMENT RECEIPT", {
        x: 40,
        y,
        font: bold,
        size: 18,
    });

    y -= 30;

    page.drawText(`Receipt: ${receiptNumber}`, {
        x: 40,
        y,
        font,
        size: 12,
    });

    y -= 20;

    page.drawText(`Order: ${order.id}`, {
        x: 40,
        y,
        font,
        size: 12,
    });

    y -= 20;

    page.drawText(`Customer: ${order.name}`, {
        x: 40,
        y,
        font,
        size: 12,
    });

    y -= 20;

    page.drawText(`Phone: ${order.phone}`, {
        x: 40,
        y,
        font,
        size: 12,
    });

    y -= 20;

    page.drawText(`Address: ${order.address}`, {
        x: 40,
        y,
        font,
        size: 12,
    });

    y -= 40;

    page.drawText("Items", {
        x: 40,
        y,
        font: bold,
        size: 16,
    });

    y -= 25;

    for (const item of order.items) {
        page.drawText(item.product.name, {
            x: 40,
            y,
            font,
            size: 12,
        });

        page.drawText(`x${item.quantity}`, {
            x: 330,
            y,
            font,
            size: 12,
        });

        page.drawText(
            `KES ${(item.price * item.quantity).toLocaleString()}`,
            {
                x: 430,
                y,
                font,
                size: 12,
            }
        );

        y -= 20;
    }

    y -= 20;

    page.drawLine({
        start: { x: 40, y },
        end: { x: 550, y },
        thickness: 1,
    });

    y -= 30;

    page.drawText(
        `TOTAL: KES ${order.totalAmount.toLocaleString()}`,
        {
            x: 330,
            y,
            font: bold,
            size: 16,
            color: rgb(0.15, 0.55, 0.20),
        }
    );

    y -= 40;

    page.drawText("Payment Status: PAID", {
        x: 40,
        y,
        font: bold,
        size: 14,
        color: rgb(0.15, 0.55, 0.20),
    });

    y -= 50;

    page.drawText(
        "Thank you for shopping with Mkulima Supply Store.",
        {
            x: 40,
            y,
            font,
            size: 12,
        }
    );

    y -= 20;

    page.drawText(
        "Join our WhatsApp Community",
        {
            x: 40,
            y,
            font: bold,
            size: 12,
        }
    );

    const qr = await QRCode.toDataURL(
        process.env.WHATSAPP_CHANNEL!
    );

    const base64 = qr.split(",")[1];

    const qrBytes = Uint8Array.from(
        Buffer.from(base64, "base64")
    );

    const qrImage = await pdf.embedPng(qrBytes);

    page.drawImage(qrImage, {
        x: 40,
        y: y - 140,
        width: 120,
        height: 120,
    });

    page.drawText(process.env.WHATSAPP_CHANNEL!, {
        x: 180,
        y: y - 40,
        font,
        size: 10,
    });

    const pdfBytes = await pdf.save();

    return Buffer.from(pdfBytes);
}