import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

interface Params {
  params: Promise<{
    orderId: string;
  }>;
}

export async function GET(
  req: NextRequest,
  { params }: Params
) {
  try {
    const session = await requireAuth();

    const { orderId } = await params;

    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      select: {
        userId: true,
        receiptUrl: true,
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

    // Prevent downloading someone else's receipt
    if (order.userId !== session.userId) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 403,
        }
      );
    }

    if (!order.receiptUrl) {
      return NextResponse.json(
        {
          error: "Receipt not generated yet",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.redirect(order.receiptUrl);
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        error: "Server error",
      },
      {
        status: 500,
      }
    );
  }
}