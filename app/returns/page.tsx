import type { Metadata } from "next";
import { Phone, MessageCircle } from "lucide-react";
import Furrows from "@/components/layout/furrows";

export const metadata: Metadata = {
  title: "Returns & Refunds | Mkulima Supply",
  description:
    "Learn about Mkulima Supply's return and refund policy for online orders.",
};

const clauses = [
  {
    tag: "Our policy",
    title: "Returns",
    body: "Mkulima Supply does not accept returns on purchased products. Customers are therefore encouraged to confirm their product selection and order details before completing an order.",
  },
  {
    tag: "When you're covered",
    title: "Refunds",
    body: "Refunds are only provided where an item that has been ordered is not available in stock. If an ordered item is unavailable, Mkulima Supply will communicate with the customer regarding the applicable refund.",
  },
  {
    tag: "If stock runs out",
    title: "Unavailable Products",
    body: "While we aim to keep product availability information accurate, stock levels can change. If an item becomes unavailable after an order has been placed, the customer will be informed and the applicable refund will be arranged.",
  },
  {
    tag: "Before you check out",
    title: "Order Information",
    body: "Customers should carefully review their order before completing payment, including the selected products, quantities, and delivery information.",
  },
];

export default function ReturnsPage() {
  return (
    <main className="min-h-screen bg-cream">
      {/* Hero */}
      <section className="relative bg-[var(--green-900)] px-6 pt-20 pb-0 text-[var(--cream)] overflow-hidden">
        <div className="mx-auto max-w-4xl pb-14">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--earth-300)]">
            Policy
          </p>
          <h1 className="font-display text-3xl leading-tight tracking-tight sm:text-5xl">
            Returns & Refunds
          </h1>
          <p className="mt-4 max-w-xl text-[var(--cream)]/60">
            Information about returns and refunds for Mkulima Supply orders.
          </p>
        </div>
        <div className="absolute inset-x-0 bottom-0 translate-y-px">
          <Furrows tone="dark" />
        </div>
      </section>

      {/* Clauses */}
      <article className="mx-auto max-w-4xl px-6 pt-16 pb-8">
        <div className="divide-y divide-[var(--earth-300)]/30">
          {clauses.map(({ tag, title, body }) => (
            <div
              key={title}
              className="grid gap-2 py-8 sm:grid-cols-[200px_1fr] sm:gap-8"
            >
              <div className="flex items-start gap-3 sm:block">
                <span
                  className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--earth-500)] sm:mt-2"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--earth-500)] sm:hidden">
                    {tag}
                  </p>
                  <h2 className="font-display text-xl text-[var(--green-900)] sm:hidden">
                    {title}
                  </h2>
                </div>
              </div>

              <div className="hidden sm:block">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--earth-500)]">
                  {tag}
                </p>
                <h2 className="mt-1 font-display text-xl text-[var(--green-900)]">
                  {title}
                </h2>
              </div>

              <p className="max-w-2xl pl-5 leading-7 text-[var(--green-800)]/80 sm:col-start-2 sm:pl-0">
                {body}
              </p>
            </div>
          ))}
        </div>
      </article>

      {/* Need Help — same card language as Contact & Shipping pages */}
      <section className="mx-auto max-w-4xl px-6 py-16">
        <div className="rounded-lg border border-[var(--earth-300)]/40 bg-[var(--green-50)] p-8">
          <h2 className="font-display text-xl text-[var(--green-900)] sm:text-2xl">
            Need help?
          </h2>
          <p className="mt-2 text-[var(--green-800)]/80">
            Questions about an order or an unavailable product — reach us
            directly:
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
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
          </div>
        </div>
      </section>
    </main>
  );
}
