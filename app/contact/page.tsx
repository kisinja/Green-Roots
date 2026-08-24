import type { Metadata } from "next";
import { Phone, MessageCircle, MapPin, ArrowRight } from "lucide-react";
import Furrows from "@/components/layout/furrows";

export const metadata: Metadata = {
  title: "Contact Us | Mkulima Supply",
  description:
    "Contact Mkulima Supply for agricultural product enquiries, orders, delivery questions, and customer support.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-cream">
      {/* Hero */}
      <section className="relative bg-[var(--green-900)] px-6 pt-24 pb-0 text-[var(--cream)] overflow-hidden">
        <div className="mx-auto max-w-4xl pb-16">
          <p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--earth-300)]">
            <MessageCircle className="h-4 w-4" />
            Contact Us
          </p>

          <h1 className="font-display text-4xl leading-tight tracking-tight sm:text-6xl">
            How can we help?
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-[var(--cream)]/70">
            Have a question about a product, order, delivery, or anything else?
            Get in touch with Mkulima Supply.
          </p>
        </div>

        <div className="absolute inset-x-0 bottom-0 translate-y-px">
          <Furrows tone="dark" />
        </div>
      </section>

      {/* Contact cards */}
      <section className="mx-auto max-w-5xl px-6 pt-20 pb-16">
        <div className="grid gap-4 sm:grid-cols-3">
          <a
            href="tel:+254746403931"
            className="rounded-lg border border-[var(--earth-300)]/50 bg-white p-6 transition-colors hover:border-[var(--green-400)] hover:shadow-sm"
          >
            <Phone className="h-5 w-5 text-[var(--green-600)]" />
            <h2 className="mt-4 font-display text-lg text-[var(--green-900)]">
              Phone
            </h2>
            <p className="mt-1.5 text-sm text-[var(--green-800)]/75">
              +254 746 403931
            </p>
          </a>

          <a
            href="https://wa.me/254746403931"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-[var(--earth-300)]/50 bg-white p-6 transition-colors hover:border-[var(--green-400)] hover:shadow-sm"
          >
            <MessageCircle className="h-5 w-5 text-[var(--green-600)]" />
            <h2 className="mt-4 font-display text-lg text-[var(--green-900)]">
              WhatsApp
            </h2>
            <p className="mt-1.5 text-sm text-[var(--green-800)]/75">
              Chat with us directly
            </p>
          </a>

          <div className="rounded-lg border border-[var(--earth-300)]/50 bg-white p-6">
            <MapPin className="h-5 w-5 text-[var(--green-600)]" />
            <h2 className="mt-4 font-display text-lg text-[var(--green-900)]">
              Location
            </h2>
            <p className="mt-1.5 text-sm text-[var(--green-800)]/75">
              Ongata Rongai, Nairobi, Kenya
            </p>
          </div>
        </div>
      </section>

      {/* Product & Order Enquiries — same treatment as Our Approach */}
      <section className="border-y border-[var(--earth-300)]/40 bg-[var(--green-50)]">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--earth-500)]">
            Before You Reach Out
          </p>
          <h2 className="mt-3 font-display text-2xl text-[var(--green-900)] sm:text-3xl">
            Product & Order Enquiries
          </h2>

          <p className="mt-4 max-w-2xl leading-7 text-[var(--green-800)]/80">
            For product availability, orders, delivery questions, or help
            choosing an agricultural product, contact us using the phone or
            WhatsApp details above.
          </p>

          <div className="mt-6 inline-flex items-center gap-2 rounded-lg border border-[var(--earth-300)] bg-white px-4 py-3 text-sm text-[var(--green-800)]/80">
            <ArrowRight className="h-4 w-4 shrink-0 text-[var(--earth-500)]" />
            Have your order number ready when contacting us about an existing
            order.
          </div>
        </div>
      </section>
    </main>
  );
}
