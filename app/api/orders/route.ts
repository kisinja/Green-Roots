import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();

    const body = await req.json().catch(() => null);

    if (!body) {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const {
      items,
      phone,
      address,
      totalAmount,
      name,
    } = body;

    // ---- VALIDATION ----
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    if (!name?.trim() || !phone?.trim() || !address?.trim()) {
      return NextResponse.json(
        { error: "Missing customer details (name, phone, address required)" },
        { status: 400 }
      );
    }

    if (!totalAmount || isNaN(Number(totalAmount))) {
      return NextResponse.json(
        { error: "Invalid total amount" },
        { status: 400 }
      );
    }

    // ---- CREATE ORDER ----
    const order = await prisma.order.create({
      data: {
        userId: session.userId,
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        totalAmount: Number(totalAmount),

        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: Number(item.quantity),
            price: Number(item.price),
          })),
        },
      },
      include: {
        items: { include: { product: true } },
      },
    });

    // ---- CREATE PAYMENT ----
    await prisma.payment.create({
      data: {
        orderId: order.id,
        provider: "INTASEND",
        amount: Number(totalAmount),
        phone: phone.trim(),
      },
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (err) {
    console.error("ORDER ERROR:", err);

    const msg = err instanceof Error ? err.message : "Server error";

    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await requireAuth();

    const orders = await prisma.order.findMany({
      where: { userId: session.userId },
      include: {
        items: {
          include: {
            product: {
              select: { name: true, emoji: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ orders });
  } catch (err) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
}