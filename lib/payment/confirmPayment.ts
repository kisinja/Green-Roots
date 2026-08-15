import { prisma } from "@/lib/prisma";
import { onPaymentConfirmed } from "./onPaymentConfirmed";

export async function confirmPayment(
  orderId: string,
  invoiceId: string
) {
  // Prevent duplicate confirmations
  const payment = await prisma.payment.findUnique({
    where: {
      orderId,
    },
  });

  if (!payment) {
    throw new Error("Payment not found.");
  }

  if (payment.status === "SUCCESS") {
    console.log("Payment already confirmed.");
    return;
  }

  await prisma.$transaction(async (tx) => {
    // Update payment
    await tx.payment.update({
      where: {
        orderId,
      },
      data: {
        status: "SUCCESS",
        providerRef: invoiceId,
      },
    });

    // Update order
    await tx.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: "CONFIRMED",
        mpesaRef: invoiceId,
      },
    });

    // Reduce stock
    const order = await tx.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      throw new Error("Order not found.");
    }

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

  // Generate receipt AFTER transaction commits
  await onPaymentConfirmed(orderId);

  console.log(`Payment confirmed for ${orderId}`);
}