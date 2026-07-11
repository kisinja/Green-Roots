import { uploadReceipt } from "@/lib/receipt/upload";
import { generateReceipt } from "@/lib/receipt/generate";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const order = await prisma.order.findFirst({
        include: {
            items: {
                include: {
                    product: true,
                },
            },
            user: true,
            payment: true,
        },
    });

    if (!order) {
        return Response.json({ error: "No orders found" }, { status: 404 });
    }

    const pdf = await generateReceipt({
        order,
        receiptNumber: "TEST-000001",
    });

    const url = await uploadReceipt(pdf, "TEST-000001");

    return Response.json({
        url,
    });
}