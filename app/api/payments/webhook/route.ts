import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleSuccessfulOrder } from "@/lib/services/orderSuccess";
import { onPaymentConfirmed } from "@/lib/payment/onPaymentConfirmed";
import { confirmPayment } from "@/lib/payment/confirmPayment";

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

            await confirmPayment(orderId, invoice_id);
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