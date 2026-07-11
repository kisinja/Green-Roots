import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ orderId: string }> }
) {
    try {
        const session = await requireAuth();
        const { orderId } = await params;

        const order = await prisma.order.findFirst({
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