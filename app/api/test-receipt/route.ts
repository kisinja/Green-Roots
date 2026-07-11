import { NextResponse } from "next/server";
import { generateReceipt } from "@/lib/receipt/generate";

export async function GET() {
  const pdf = await generateReceipt({
    receiptNumber: "RCPT-000001",

    order: {
      id: "ORDER-001",
      name: "Elvis Githinji",
      phone: "0712345678",
      address: "Thika, Kenya",
      totalAmount: 3450,

      items: [
        {
          quantity: 2,
          price: 500,
          product: {
            name: "DAP Fertilizer",
          },
        },
        {
          quantity: 3,
          price: 650,
          product: {
            name: "Tomato Seeds",
          },
        },
      ],
    },
  });

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="receipt.pdf"',
    },
  });
}