import { sendStkPush } from "@/lib/intasend";
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const { orderId } = await req.json();

        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { user: true },
        });

        if (!order) {
            return Response.json(
                { error: "Order not found" },
                { status: 404 }
            );
        }

        const payment = await sendStkPush({
            orderId: order.id,
            amount: order.totalAmount,
            phone: order.phone,
            email: order.user.email,
        });

        return Response.json(payment);

    } catch (e) {
        const msg = e instanceof Error ? e.message : "Server error";
        console.log("Payment collection error:", msg);
        return Response.json({ error: msg }, { status: 500 });
    }
}