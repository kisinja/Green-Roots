// /lib/payment/onPaymentConfirmed.ts

import { handleSuccessfulOrder } from "../services/orderSuccess";

export async function onPaymentConfirmed(orderId: string) {
  try {
    console.log(`Processing receipt for ${orderId}`);

    await handleSuccessfulOrder(orderId);

    console.log(`Receipt generated successfully.`);
  } catch (err) {
    console.error("Receipt generation failed:", err);

    // Don't throw.
    // Payment has already been confirmed.
  }
}