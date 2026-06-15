"use client";

import { useState } from "react";
import { useCart } from "@/store/cart";
import { formatKES } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle } from "lucide-react";
import { showToast } from "../ui/Toaster";

type Step = "details" | "paying" | "done";

export function CheckoutClient() {
  const { items, total, clearCart } = useCart();
  const router = useRouter();

  const [step, setStep] = useState<Step>("details");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const totalAmount = total();

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  if (items.length === 0 && step === "details") {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-4xl mb-3">🛒</p>
        <p className="mb-4">Your cart is empty.</p>
        <a className="text-green-700 font-semibold" href="/shop">
          Browse products →
        </a>
      </div>
    );
  }

  const handleCheckout = async () => {
    const name = form.name.trim();
    const phone = form.phone.trim();
    const address = form.address.trim();

    if (!name || !phone || !address) {
      setError("Please fill in all fields.");
      return;
    }

    setError("");
    setStep("paying");

    try {
      const payload = {
        items: items.map((i) => ({
          productId: i.product.id,
          quantity: i.quantity,
          price: i.product.price,
        })),
        phone,
        address,
        totalAmount,
        name,
      };

      console.log("ORDER PAYLOAD:", payload);

      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await orderRes.json();

      if (!orderRes.ok) {
        if (orderRes.status === 401) {
          router.push("/login?redirect=/checkout");
          return;
        }
        throw new Error(data.error || "Failed to create order");
      }

      const order = data.order;

      const stkRes = await fetch("/api/payments/collect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.id }),
      });

      if (!stkRes.ok) {
        throw new Error("M-Pesa push failed. Try WhatsApp order.");
      }

      showToast("STK Push sent! Check your phone.", "success");

      clearCart();
      setStep("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStep("details");
    }
  };

  if (step === "done") {
    return (
      <div className="text-center py-16">
        <CheckCircle size={56} className="text-green-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold">Order placed!</h2>
        <p className="text-gray-500">Complete payment on your phone.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* FORM */}
      <div className="space-y-4">
        <input
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          placeholder="Full Name"
          className="input"
        />

        <input
          value={form.phone}
          onChange={(e) => set("phone", e.target.value)}
          placeholder="Phone"
          className="input"
        />

        <input
          value={form.address}
          onChange={(e) => set("address", e.target.value)}
          placeholder="Address"
          className="input"
        />

        {error && <p className="text-red-500">{error}</p>}
      </div>

      {/* BUTTON */}
      <button
        onClick={handleCheckout}
        disabled={step === "paying"}
        className="w-full bg-green-700 text-white py-4 rounded-xl"
      >
        {step === "paying" ? (
          <>
            <Loader2 className="animate-spin inline mr-2" />
            Processing...
          </>
        ) : (
          `Pay ${formatKES(totalAmount)}`
        )}
      </button>
    </div>
  );
}
