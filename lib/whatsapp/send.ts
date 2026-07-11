import { sendDocument, sendText } from "./client";

interface CustomerReceiptParams {
  order: any;
  receiptUrl: string;
  receiptNumber: string;
}

interface AdminNotificationParams {
  order: any;
  receiptUrl: string;
  receiptNumber: string;
}

export async function sendCustomerReceipt({
  order,
  receiptUrl,
  receiptNumber,
}: CustomerReceiptParams) {
  const message = `🌱 AgroBiz

Hello ${order.name},

Thank you for shopping with us.

Receipt: ${receiptNumber}

Order Total: KES ${order.totalAmount}

Your receipt is attached.

Join our WhatsApp Channel:
${process.env.WHATSAPP_CHANNEL}`;

  await sendDocument({
    to: order.phone,
    url: receiptUrl,
    filename: `${receiptNumber}.png`,
    caption: message,
  });
}

export async function sendAdminNotification({
  order,
  receiptUrl,
  receiptNumber,
}: AdminNotificationParams) {
  const items = order.items
    .map(
      (item: any) =>
        `• ${item.product.name} x${item.quantity}`
    )
    .join("\n");

  const message = `🔔 NEW ORDER

Receipt: ${receiptNumber}

Customer: ${order.name}

Phone: ${order.phone}

Amount: KES ${order.totalAmount}

Items:

${items}`;

  await sendDocument({
    to: process.env.WHATSAPP_ADMIN_PHONE!,
    url: receiptUrl,
    filename: `${receiptNumber}.png`,
    caption: message,
  });
}