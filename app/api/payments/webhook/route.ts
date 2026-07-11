import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleSuccessfulOrder } from "@/lib/services/orderSuccess";
import { onPaymentConfirmed } from "@/lib/payment/onPaymentConfirmed";

export async function POST(req: NextRequest) {
    try {
        const payload = await req.json();

        console.log("INTASEND WEBHOOK:", payload);

        const {
            state,
            api_ref,
            challenge,
            invoice_id,
        } = payload;

        // Verify webhook secret
        if (challenge !== process.env.INTASEND_WEBHOOK_SECRET) {
            return NextResponse.json(
                { error: "Invalid webhook challenge" },
                { status: 401 }
            );
        }

        const orderId = api_ref;

        if (!orderId) {
            return NextResponse.json(
                { error: "Missing order reference" },
                { status: 400 }
            );
        }

        // Successful payment
        if (state === "COMPLETE") {
            const payment = await prisma.payment.findUnique({
                where: {
                    orderId,
                },
            });

            if (!payment) {
                return NextResponse.json(
                    { error: "Payment not found" },
                    { status: 404 }
                );
            }

            // Prevent duplicate processing
            if (payment.status === "SUCCESS") {
                return NextResponse.json({
                    success: true,
                    message: "Already processed",
                });
            }

            await prisma.$transaction(async (tx) => {
                await tx.payment.update({
                    where: {
                        orderId,
                    },
                    data: {
                        status: "SUCCESS",
                        providerRef: invoice_id,
                    },
                });

                await tx.order.update({
                    where: {
                        id: orderId,
                    },
                    data: {
                        status: "CONFIRMED",
                        mpesaRef: invoice_id,
                    },
                });

                const order = await tx.order.findUnique({
                    where: {
                        id: orderId,
                    },
                    include: {
                        items: true,
                    },
                });

                if (!order) return;

                for (const item of order.items) {
                    await tx.product.update({
                        where: {
                            id: item.productId,
                        },
                        data: {
                            stock: {
                                decrement: item.quantity,
                            },
                        },
                    });
                }
            });

            await onPaymentConfirmed(orderId);
        }

        // Failed payment
        if (state === "FAILED") {
            await prisma.payment.updateMany({
                where: {
                    orderId,
                },
                data: {
                    status: "FAILED",
                },
            });
        }

        return NextResponse.json({
            success: true,
        });
    } catch (error) {
        console.error("Webhook Error:", error);

        return NextResponse.json(
            {
                error: "Webhook processing failed",
            },
            {
                status: 500,
            }
        );
    }
}