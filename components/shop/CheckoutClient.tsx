"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/store/cart";
import { formatKES } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Loader2, MapPin, Phone, User } from "lucide-react";
import { showToast } from "../ui/Toaster";

type Step = "details" | "paying";

export function CheckoutClient() {
const { items, total, clearCart } = useCart();
const router = useRouter();

const [step, setStep] = useState<Step>("details");
const [error, setError] = useState("");
const [loadingUser, setLoadingUser] = useState(true);

const [form, setForm] = useState({
name: "",
phone: "",
address: "",
});

const totalAmount = total();

const set = (k: string, v: string) =>
setForm((f) => ({ ...f, [k]: v }));

// Fetch logged-in user's details and auto-fill the form
useEffect(() => {
const fetchUser = async () => {
try {
const res = await fetch("/api/auth/me", {
method: "GET",
credentials: "include",
cache: "no-store",
});

    const data = await res.json();

    if (!res.ok || !data.user) {
      router.push("/login?redirect=/checkout");
      return;
    }

    setForm((current) => ({
      ...current,
      name: data.user.name ?? "",
      phone: data.user.phone ?? "",
    }));
  } catch {
    setError("Unable to load your account details.");
  } finally {
    setLoadingUser(false);
  }
};

fetchUser();

}, [router]);

if (items.length === 0 && step === "details") {
return (
<div className="py-16 text-center">
<div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-3xl">
🛒
</div>

    <p className="font-display text-xl font-semibold text-green-900">
      Your cart is empty.
    </p>

    <p className="mt-2 mb-5 text-sm text-green-800/60">
      Add some products before checking out.
    </p>

    <a
      className="inline-flex items-center rounded-xl bg-green-700 px-5 py-3 font-semibold text-white transition-colors hover:bg-green-800"
      href="/shop"
    >
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

  showToast(
    "STK Push sent! Complete the payment on your phone.",
    "success",
  );

  await new Promise((resolve) => setTimeout(resolve, 700));

  // Clear the local cart
  clearCart();

  // Redirect to the payment status page
  router.push(`/orders/success/${order.id}`);
} catch (err) {
  setError(err instanceof Error ? err.message : "Something went wrong");
  setStep("details");
}

};

return (
<div className="space-y-5">
{/* FORM CARD /}
<div className="overflow-hidden rounded-2xl border border-green-100 bg-white shadow-sm">
{/ HEADER */}
<div className="border-b border-green-100 bg-green-50 px-5 py-5">
<h2 className="font-display text-xl font-semibold text-green-900">
Delivery details
</h2>

      <p className="mt-1 text-sm text-green-800/60">
        Confirm your details before placing your order.
      </p>
    </div>

    <div className="space-y-5 p-5">
      {/* LOADING USER */}
      {loadingUser && (
        <div className="flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
          <Loader2 size={16} className="animate-spin" />
          Loading your account details...
        </div>
      )}

      {/* NAME */}
      <div>
        <label
          htmlFor="checkout-name"
          className="mb-2 block text-sm font-semibold text-green-900"
        >
          Full Name
        </label>

        <div className="relative">
          <User
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600"
          />

          <input
            id="checkout-name"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Full Name"
            autoComplete="name"
            disabled={loadingUser || step === "paying"}
            className="w-full rounded-xl border border-green-100 bg-cream py-3.5 pl-11 pr-4 text-green-900 outline-none transition-all placeholder:text-green-900/40 focus:border-green-400 focus:ring-4 focus:ring-green-100 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>
      </div>

      {/* PHONE */}
      <div>
        <label
          htmlFor="checkout-phone"
          className="mb-2 block text-sm font-semibold text-green-900"
        >
          Phone Number
        </label>

        <div className="relative">
          <Phone
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600"
          />

          <input
            id="checkout-phone"
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
            placeholder="Phone Number"
            autoComplete="tel"
            disabled={loadingUser || step === "paying"}
            className="w-full rounded-xl border border-green-100 bg-cream py-3.5 pl-11 pr-4 text-green-900 outline-none transition-all placeholder:text-green-900/40 focus:border-green-400 focus:ring-4 focus:ring-green-100 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        <p className="mt-2 text-xs text-green-800/50">
          This number will receive the M-Pesa payment prompt.
        </p>
      </div>

      {/* ADDRESS */}
      <div>
        <label
          htmlFor="checkout-address"
          className="mb-2 block text-sm font-semibold text-green-900"
        >
          Delivery Address
        </label>

        <div className="relative">
          <MapPin
            size={18}
            className="absolute left-4 top-4 text-green-600"
          />

          <textarea
            id="checkout-address"
            value={form.address}
            onChange={(e) => set("address", e.target.value)}
            placeholder="Enter your delivery address"
            autoComplete="street-address"
            rows={3}
            disabled={step === "paying"}
            className="w-full resize-none rounded-xl border border-green-100 bg-cream py-3.5 pl-11 pr-4 text-green-900 outline-none transition-all placeholder:text-green-900/40 focus:border-green-400 focus:ring-4 focus:ring-green-100 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        <p className="mt-2 text-xs text-green-800/50">
          Your delivery address is required for this order.
        </p>
      </div>

      {/* ERROR */}
      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {error}
        </div>
      )}
    </div>
  </div>

  {/* TOTAL */}
  <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-green-800/60">
          Order total
        </p>

        <p className="mt-1 font-display text-2xl font-bold text-green-900">
          {formatKES(totalAmount)}
        </p>
      </div>

      <div className="rounded-xl bg-green-50 px-3 py-2 text-xs font-semibold text-green-700">
        M-Pesa
      </div>
    </div>
  </div>

  {/* BUTTON */}
  <button
    onClick={handleCheckout}
    disabled={step === "paying" || loadingUser}
    className="flex w-full items-center justify-center rounded-xl bg-green-700 py-4 font-semibold text-white shadow-sm transition-all hover:bg-green-800 hover:shadow-md active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
  >
    {step === "paying" ? (
      <>
        <Loader2 className="mr-2 animate-spin" size={20} />
        Sending STK Push...
      </>
    ) : loadingUser ? (
      <>
        <Loader2 className="mr-2 animate-spin" size={20} />
        Loading details...
      </>
    ) : (
      `Pay ${formatKES(totalAmount)}`
    )}
  </button>
</div>

);
}