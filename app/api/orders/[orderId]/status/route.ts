import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { confirmPayment } from "@/lib/payment/confirmPayment";
import { verifyPayment } from "@/lib/intasend/verifyPayment";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ orderId: string }> }
) {
    try {
        const session = await requireAuth();
        const { orderId } = await params;

        let order = await prisma.order.findFirst({
            where: {
                id: orderId,
                userId: session.userId,
            },
            select: {
                id: true,
                status: true,
                totalAmount: true,
                receiptUrl: true,
                receiptNumber: true,
                mpesaRef: true,
                createdAt: true,
                payment: true,
            },
        });

        if (!order) {
            return NextResponse.json(
                {
                    error: "Order not found",
                },
                {
                    status: 404,
                }
            );
        }

        // Already confirmed
        if (order.status === "CONFIRMED") {
            return NextResponse.json(order);
        }

        // No invoice saved yet
        if (!order.payment?.providerRef) {
            return NextResponse.json(order);
        }

        try {
            const verification = await verifyPayment(
                order.payment.providerRef
            );

            const paid =
                verification.state === "COMPLETE" ||
                verification.status === "COMPLETE" ||
                verification.state === "SUCCESS" ||
                verification.status === "SUCCESS";

            if (paid) {
                await confirmPayment(
                    order.id,
                    order.payment.providerRef
                );

                order = await prisma.order.findUnique({
                    where: {
                        id: order.id,
                    },
                    include: {
                        payment: true,
                    },
                });
            }
        } catch (err) {
            console.error("Verification failed:", err);
        }


        return NextResponse.json(order);
    } catch (err) {
        console.error(err);

        return NextResponse.json(
            {
                error: "Unauthorized",
            },
            {
                status: 401,
            }
        );
    }
}