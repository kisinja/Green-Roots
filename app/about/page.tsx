import type { Metadata } from "next";
import Link from "next/link";
import { Sprout, BookOpen, ShoppingBag, Phone, ArrowRight } from "lucide-react";
import Furrows from "@/components/layout/furrows";

export const metadata: Metadata = {
  title: "About Us | Mkulima Supply",
  description:
    "Learn about Mkulima Supply and our mission to make quality agricultural products and farming information accessible to Kenyan farmers.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-cream">
      {/* Hero */}
      <section className="relative bg-[var(--green-900)] px-6 pt-24 pb-0 text-[var(--cream)] overflow-hidden">
        <div className="mx-auto max-w-4xl pb-16">
          <p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--earth-300)]">
            <Sprout className="h-4 w-4" />
            About Mkulima Supply
          </p>

          <h1 className="font-display text-4xl leading-tight tracking-tight sm:text-6xl">
            Supporting better
            <br />
            farming in Kenya
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-[var(--cream)]/70">
            An agricultural marketplace focused on making quality farming
            products and useful agricultural information more accessible to
            farmers across Kenya.
          </p>
        </div>

        {/* furrow divider into the cream section below */}
        <div className="absolute inset-x-0 bottom-0 translate-y-px">
          <Furrows tone="dark" />
        </div>
      </section>

      {/* Mission — editorial pull statement */}
      <section className="mx-auto max-w-4xl px-6 pt-20 pb-16">
        <div className="grid gap-8 sm:grid-cols-[120px_1fr]">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--earth-500)] sm:pt-2">
            Our Mission
          </p>
          <p className="font-display text-2xl italic leading-relaxed text-[var(--green-900)] sm:text-3xl">
            "We believe farmers should be able to discover agricultural
            products, understand how to use them, and access useful farming
            knowledge — all from one convenient platform."
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-6">
        <Furrows tone="light" />
      </div>

      {/* What We Offer — seed-packet style cards */}
      <section className="mx-auto max-w-4xl px-6 py-16">
        <h2 className="font-display text-3xl text-[var(--green-900)]">
          What We Offer
        </h2>
        <p className="mt-3 max-w-2xl text-[var(--green-800)]/80">
          Mkulima Supply provides agricultural products and resources for
          farmers and agricultural enthusiasts, designed to make product
          discovery and access to farming information simple.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {[
            {
              icon: ShoppingBag,
              title: "Agricultural inputs",
              desc: "A range of farming products, from seeds to equipment.",
            },
            {
              icon: BookOpen,
              title: "Farming guides",
              desc: "Practical agricultural articles and how-to content.",
            },
            {
              icon: ArrowRight,
              title: "Convenient ordering",
              desc: "Browse, order, and track deliveries entirely online.",
            },
            {
              icon: Phone,
              title: "Real support",
              desc: "Reach our team directly by phone or WhatsApp.",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-lg border border-[var(--earth-300)]/50 bg-white p-6 transition-colors hover:border-[var(--green-400)]"
            >
              <Icon className="h-5 w-5 text-[var(--green-600)]" />
              <h3 className="mt-4 font-display text-lg text-[var(--green-900)]">
                {title}
              </h3>
              <p className="mt-1.5 text-sm leading-6 text-[var(--green-800)]/75">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Our Approach — split with earth spine */}
      <section className="border-y border-[var(--earth-300)]/40 bg-[var(--green-50)]">
        <div className="mx-auto grid max-w-4xl gap-10 px-6 py-16 sm:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl text-[var(--green-900)]">
              Our Approach
            </h2>
            <p className="mt-4 text-[var(--green-800)]/80 leading-7">
              We aim to provide clear product information and useful educational
              content, while continuously improving the experience for our
              customers.
            </p>
          </div>
          <div className="border-t border-[var(--earth-300)]/50 pt-6 sm:border-t-0 sm:border-l sm:pl-10 sm:pt-0">
            <p className="text-sm leading-7 text-[var(--green-800)]/70">
              Our agricultural content offers general information and practical
              guidance. Farmers should weigh their specific crops, location,
              soil conditions, and professional agricultural advice when making
              important farming decisions.
            </p>
          </div>
        </div>
      </section>

      {/* Get in Touch */}
      <section className="mx-auto max-w-4xl px-6 py-20">
        <div className="rounded-2xl bg-[var(--green-900)] px-8 py-12 text-center text-[var(--cream)] sm:px-16">
          <h2 className="font-display text-2xl sm:text-3xl">Get in Touch</h2>
          <p className="mx-auto mt-3 max-w-md text-[var(--cream)]/70">
            Have a question about a product or need help with an order? Contact
            our team and we'll be happy to assist.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--earth-300)] px-6 py-3 text-sm font-semibold text-[var(--green-900)] transition-colors hover:bg-[var(--earth-500)] hover:text-white"
          >
            Contact Mkulima Supply
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
