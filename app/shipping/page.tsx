import type { Metadata } from "next";
import { Phone, MessageCircle, MapPin } from "lucide-react";
import Furrows from "@/components/layout/furrows";

export const metadata: Metadata = {
  title: "Shipping & Delivery | Mkulima Supply",
  description:
    "Learn about Mkulima Supply's nationwide delivery service, delivery charges, and order fulfilment.",
};

const sections = [
  {
    n: "01",
    title: "Nationwide Delivery",
    body: [
      "Mkulima Supply offers delivery services across Kenya. Delivery availability and arrangements may vary depending on the customer's location and the nature of the order.",
    ],
  },
  {
    n: "02",
    title: "Delivery Charges",
    body: [
      "Delivery charges are not fixed. The applicable delivery fee depends on factors including the delivery location and the size of the package.",
      "Customers will be informed of the applicable delivery charge when arranging their order.",
    ],
  },
  {
    n: "03",
    title: "Delivery Times",
    body: [
      "Delivery times may vary depending on the customer's location, order processing, product availability, and delivery arrangements.",
      "Customers may contact Mkulima Supply for information about the expected delivery timeframe for a specific order.",
    ],
  },
  {
    n: "04",
    title: "Delivery Information",
    body: [
      "Customers should provide accurate contact and delivery information when placing an order. Incorrect or incomplete information may affect the delivery of an order.",
    ],
  },
  {
    n: "05",
    title: "Cash on Delivery",
    body: [
      "Mkulima Supply does not currently offer cash-on-delivery payments. Orders must be paid using an available supported payment method before fulfilment.",
    ],
  },
  {
    n: "06",
    title: "Delivery Issues",
    body: [
      "If you experience an issue with your delivery, contact Mkulima Supply as soon as possible using the contact details provided on our website.",
    ],
  },
];

export default function ShippingPage() {
  return (
    <main className="min-h-screen bg-cream">
      {/* Hero */}
      <section className="relative bg-[var(--green-900)] px-6 pt-20 pb-0 text-[var(--cream)] overflow-hidden">
        <div className="mx-auto max-w-4xl pb-14">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--earth-300)]">
            Delivery Route
          </p>
          <h1 className="font-display text-3xl leading-tight tracking-tight sm:text-5xl">
            Shipping & Delivery
          </h1>
          <p className="mt-4 max-w-xl text-[var(--cream)]/60">
            Information about delivery for orders placed through Mkulima Supply.
          </p>
        </div>
        <div className="absolute inset-x-0 bottom-0 translate-y-px">
          <Furrows tone="dark" />
        </div>
      </section>

      {/* Route spine */}
      <article className="mx-auto max-w-4xl px-6 pt-16 pb-8">
        <div className="relative">
          <div
            className="absolute left-[27px] top-3 bottom-3 w-px bg-[var(--earth-300)] sm:left-[35px]"
            aria-hidden="true"
          />
          <div className="space-y-12">
            {sections.map(({ n, title, body }) => (
              <div key={n} className="relative flex gap-6 sm:gap-8">
                <span className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[var(--earth-300)] bg-cream font-display text-lg text-[var(--earth-500)] sm:h-[70px] sm:w-[70px] sm:text-xl">
                  {n}
                </span>
                <div className="pt-2 sm:pt-4">
                  <h2 className="font-display text-xl text-[var(--green-900)] sm:text-2xl">
                    {title}
                  </h2>
                  <div className="mt-2 max-w-2xl space-y-2 leading-7 text-[var(--green-800)]/80">
                    {body.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </article>

      {/* Contact Us — same card language as the Contact/Returns pages */}
      <section className="mx-auto max-w-4xl px-6 py-16">
        <div className="rounded-lg border border-[var(--earth-300)]/40 bg-[var(--green-50)] p-8">
          <h2 className="font-display text-xl text-[var(--green-900)] sm:text-2xl">
            Questions about delivery?
          </h2>
          <p className="mt-2 text-[var(--green-800)]/80">
            Reach Mkulima Supply directly:
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <a
              href="tel:+254746403931"
              className="flex items-center gap-3 rounded-lg border border-[var(--earth-300)]/50 bg-white p-4 transition-colors hover:border-[var(--green-400)]"
            >
              <Phone className="h-4 w-4 shrink-0 text-[var(--green-600)]" />
              <span className="text-sm text-[var(--green-800)]/80">
                +254 746 403931
              </span>
            </a>
            <a
              href="https://wa.me/254746403931"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-lg border border-[var(--earth-300)]/50 bg-white p-4 transition-colors hover:border-[var(--green-400)]"
            >
              <MessageCircle className="h-4 w-4 shrink-0 text-[var(--green-600)]" />
              <span className="text-sm text-[var(--green-800)]/80">
                WhatsApp
              </span>
            </a>
            <div className="flex items-center gap-3 rounded-lg border border-[var(--earth-300)]/50 bg-white p-4">
              <MapPin className="h-4 w-4 shrink-0 text-[var(--green-600)]" />
              <span className="text-sm text-[var(--green-800)]/80">
                Ongata Rongai, Nairobi, Kenya
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
