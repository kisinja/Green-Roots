import { NextResponse } from "next/server";
import { generateReceipt } from "@/lib/receipt/generate";
import { uploadReceipt } from "@/lib/receipt/upload";

export async function GET() {
    const pdf = await generateReceipt({
        receiptNumber: "RCPT-000001",

        order: {
            id: "ORDER-002",
            name: "Elvis",
            phone: "0712345678",
            address: "Thika",
            totalAmount: 3200,

            items: [
                {
                    quantity: 1,
                    price: 3200,
                    product: {
                        name: "DAP Fertilizer",
                    },
                },
            ],
        },
    });

    console.log(pdf.length)

    const url = await uploadReceipt(
        pdf,
        "RCPT-000002"
    );

    return NextResponse.json({
        url,
    });
}