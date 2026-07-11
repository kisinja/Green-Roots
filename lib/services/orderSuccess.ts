import { prisma } from "@/lib/prisma";
import { generateReceipt } from "@/lib/receipt/generate";
import { uploadReceipt } from "@/lib/receipt/upload";
import { generateReceiptNumber } from "@/lib/receipt/receiptNumber";

import {
  sendCustomerReceipt,
  sendAdminNotification,
} from "@/lib/whatsapp/send";

export async function handleSuccessfulOrder(orderId: string) {
  try {
    // Prevent duplicate WhatsApp messages
    const existing = await prisma.order.findUnique({
      where: { id: orderId },
      select: {
        waMessage: true,
      },
    });

    if (!existing) {
      throw new Error("Order not found.");
    }

    if (existing.waMessage) {
      console.log("WhatsApp already sent.");
      return;
    }

    // Fetch complete order
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        user: true,

        items: {
          include: {
            product: true,
          },
        },

        payment: true,
      },
    });

    if (!order) {
      throw new Error("Order not found.");
    }

    // Generate receipt number
    const receiptNumber = await generateReceiptNumber();

    // Generate receipt image
    const receiptBuffer = await generateReceipt({
      order,
      receiptNumber,
    });

    // Upload receipt
    const receiptUrl = await uploadReceipt(
      receiptBuffer,
      receiptNumber
    );

    // Send customer WhatsApp
    await sendCustomerReceipt({
      order,
      receiptUrl,
      receiptNumber,
    });

    // Send admin WhatsApp
    await sendAdminNotification({
      order,
      receiptUrl,
      receiptNumber,
    });

    // Save info
    await prisma.order.update({
      where: {
        id: order.id,
      },

      data: {
        waMessage: true,

        waSentAt: new Date(),

        receiptUrl,

        receiptNumber,
      },
    });

    console.log(
      `WhatsApp automation completed for ${order.id}`
    );
  } catch (err) {
    console.error(err);

    throw err;
  }
}