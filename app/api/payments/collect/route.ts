import { prisma } from "@/lib/prisma";
import { sendStkPush } from "@/lib/intasend";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const orderId = body?.orderId;

        if (!orderId) {
            return Response.json(
                { error: "Order ID is required" },
                { status: 400 }
            );
        }

        const order = await prisma.order.findUnique({
            where: {
                id: orderId,
            },
            include: {
                user: true,
            },
        });

        if (!order) {
            return Response.json(
                { error: "Order not found" },
                { status: 404 }
            );
        }

        if (!order.user?.email) {
            return Response.json(
                { error: "Customer email missing" },
                { status: 400 }
            );
        }

        if (!order.phone) {
            return Response.json(
                { error: "Customer phone missing" },
                { status: 400 }
            );
        }

        const payment = await sendStkPush({
            orderId: order.id,
            amount: Number(order.totalAmount),
            phone: order.phone,
            email: order.user.email,
        });

        return Response.json(payment);
    } catch (error) {
        console.error("PAYMENT COLLECTION ERROR:", error);

        const message =
            error instanceof Error
                ? error.message
                : "Failed to initiate payment";

        return Response.json(
            {
                error: message,
            },
            {
                status: 500,
            }
        );
    }
}