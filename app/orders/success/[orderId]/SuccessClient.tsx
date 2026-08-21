"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Loader2,
  ShieldCheck,
  Receipt,
  Smartphone,
  CheckCircle2,
  Download,
} from "lucide-react";
import { showToast } from "@/components/ui/Toaster";

interface Props {
  orderId: string;
}

export default function SuccessClient({ orderId }: Props) {
  const [loading, setLoading] = useState(true);

  const [checking, setChecking] = useState(false);

  const [order, setOrder] = useState<any>(null);

  const MAX_POLLS = 40; // 40 × 3s = 2 minutes

  let polls = 0;

  useEffect(() => {
    let interval: NodeJS.Timeout;

    async function checkStatus() {
      polls++;

      try {
        const res = await fetch(`/api/orders/${orderId}/status`, {
          cache: "no-store",
        });

        if (!res.ok) return;

        const data = await res.json();

        setOrder(data);

        if (data.status === "CONFIRMED" && data.receiptUrl) {
          clearInterval(interval);
          return;
        }

        if (polls >= MAX_POLLS) {
          clearInterval(interval);
        }
      } catch (err) {
        console.error(err);
      }

      setLoading(false);
    }

    checkStatus();

    interval = setInterval(checkStatus, 3000);

    return () => clearInterval(interval);
  }, [orderId]);

  const checkPaymentNow = async () => {
    try {
      setChecking(true);

      const res = await fetch(`/api/orders/${orderId}/status`, {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Unable to check payment.");
      }

      const data = await res.json();

      setOrder(data);

      if (data.status === "CONFIRMED") {
        return;
      }

      showToast(
        "Payment is still pending. If you've just paid, please wait a few moments and try again.",
      );
    } catch (err) {
      console.error(err);

      showToast("Unable to verify payment at the moment.", "error");
    } finally {
      setChecking(false);
    }
  };

  return (
    <main className="min-h-screen bg-cream py-14 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Card */}

        <div className="bg-white rounded-3xl shadow-xl border border-green-100 overflow-hidden">
          {/* Header */}

          <div className="bg-gradient-to-r from-[var(--green-700)] to-[var(--green-600)] p-8 text-white">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center">
                <Smartphone size={34} />
              </div>

              <div>
                <h1 className="font-display text-3xl font-bold">
                  Payment Initiated
                </h1>

                <p className="text-green-100 mt-1">
                  We've sent an M-Pesa payment request to your phone.
                </p>
              </div>
            </div>
          </div>

          {/* Body */}

          <div className="p-10">
            {/* Status */}

            <div className="flex items-center gap-4 bg-green-50 rounded-2xl p-5 border border-green-100">
              {order?.status === "CONFIRMED" ? (
                <CheckCircle2 className="text-green-700" size={34} />
              ) : (
                <Loader2 className="animate-spin text-green-700" size={34} />
              )}

              <div>
                <h2 className="font-semibold text-lg text-green-900">
                  {order?.status === "CONFIRMED"
                    ? "Payment Confirmed!"
                    : "Waiting for payment..."}
                </h2>

                <p className="text-gray-600 mt-1">
                  {order?.status === "CONFIRMED"
                    ? "Your receipt has been generated successfully."
                    : "Complete the payment prompt on your phone."}
                </p>
              </div>
            </div>

            {/* Order Details */}

            <div className="mt-8 rounded-2xl border border-gray-200 p-6">
              <p className="text-sm text-gray-500">Order Reference</p>

              <p className="mt-2 font-mono text-green-800 text-lg break-all">
                {orderId}
              </p>
            </div>

            {loading ? null : order?.status === "CONFIRMED" ? (
              <div className="mt-8 rounded-2xl border border-green-200 bg-green-50 p-6">
                <h3 className="font-semibold text-green-900">
                  Payment Successful
                </h3>

                <div className="mt-4 space-y-2">
                  <p>
                    <span className="font-semibold">Receipt:</span>{" "}
                    {order.receiptNumber}
                  </p>

                  <p>
                    <span className="font-semibold">M-Pesa Ref:</span>{" "}
                    {order.mpesaRef}
                  </p>
                </div>

                <div className="mt-6 flex gap-4">
                  {order?.receiptNumber && (
                    <a
                      href={`/api/orders/${orderId}/receipt`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-[var(--green-700)] px-6 py-3 text-white hover:bg-[var(--green-800)] transition"
                    >
                      <Download size={18} />
                      Download Receipt
                    </a>
                  )}

                  <Link
                    href="/shop"
                    className="rounded-xl border border-green-700 px-6 py-3 text-green-700 hover:bg-green-50 transition"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            ) : null}

            {/* Timeline */}

            <div className="mt-10 space-y-6">
              <div className="flex gap-4">
                <ShieldCheck className="text-green-700 mt-1" size={22} />

                <div>
                  <h3 className="font-semibold">Secure Payment</h3>

                  <p className="text-gray-500">
                    Your payment is securely processed through M-Pesa.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Receipt className="text-[var(--earth-500)] mt-1" size={22} />

                <div>
                  <h3 className="font-semibold">Receipt Generation</h3>

                  <p className="text-gray-500">
                    Immediately after payment, we'll generate your receipt
                    automatically.
                  </p>
                </div>
              </div>
            </div>

            {/* Info */}

            <div className="mt-10 rounded-2xl bg-[var(--cream)] border border-[var(--earth-300)] p-5">
              <h3 className="font-semibold text-[var(--earth-500)]">
                Please don't close this page
              </h3>

              <p className="text-gray-600 mt-2 leading-7">
                This page automatically checks your payment every few seconds.
                Once payment is confirmed, you'll immediately be able to
                download your receipt.
              </p>
            </div>

            {order?.status !== "CONFIRMED" && (
              <div className="mt-6">
                <button
                  onClick={checkPaymentNow}
                  disabled={checking}
                  className="w-full rounded-xl bg-[var(--green-700)] py-3 font-semibold text-white transition hover:bg-[var(--green-800)] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {checking ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Checking Payment...
                    </span>
                  ) : (
                    "Check Payment Again"
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
