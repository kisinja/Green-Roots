import Furrows from "@/components/layout/furrows";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | Mkulima Supply",
  description:
    "Read the terms and conditions governing the use of the Mkulima Supply website and online store.",
};

const sections = [
  {
    n: "1",
    title: "Using Our Website",
    body: [
      "By using Mkulima Supply, you agree to use the website lawfully and in a manner that does not interfere with the operation, security, or availability of the service.",
    ],
  },
  {
    n: "2",
    title: "Customer Accounts",
    body: [
      "Customers are required to create an account before placing an order through Mkulima Supply.",
      "Customers are responsible for providing accurate and up-to-date information when creating and maintaining their accounts and for keeping their account credentials secure.",
    ],
  },
  {
    n: "3",
    title: "Products",
    body: [
      "We make reasonable efforts to ensure that product descriptions, images, prices, and availability are accurate. However, product information may occasionally change or contain errors.",
      "We reserve the right to correct errors and update product information when necessary.",
    ],
  },
  {
    n: "4",
    title: "Orders",
    body: [
      "Placing an order through the website constitutes a request to purchase the selected products. Orders are subject to product availability and successful payment.",
      "If an ordered item is unavailable, Mkulima Supply will inform the customer and handle the applicable refund in accordance with our Returns & Refunds policy.",
    ],
  },
  {
    n: "5",
    title: "Pricing",
    body: [
      "Product prices displayed on the website are subject to change. Where applicable, delivery charges or other applicable charges will be communicated during the ordering process.",
      "Delivery charges depend on the customer's location and the size of the package.",
    ],
  },
  {
    n: "6",
    title: "Payments",
    body: [
      "Mkulima Supply currently accepts payments through M-Pesa using IntaSend.",
      "Cash on delivery is not currently available. Orders must be paid through the available payment method before fulfilment and delivery.",
    ],
  },
  {
    n: "7",
    title: "Delivery",
    body: [
      "Mkulima Supply provides delivery services nationwide in Kenya.",
      "Delivery charges depend on the customer's location and the size of the package.",
      "Delivery times may vary depending on the customer's location, product availability, order processing, and delivery arrangements.",
      "Please refer to our Shipping & Delivery page for additional information.",
    ],
  },
  {
    n: "8",
    title: "Returns and Refunds",
    body: [
      "Mkulima Supply does not accept returns on purchased products.",
      "Refunds are only provided where an ordered item is unavailable in stock. In such circumstances, the customer will be informed and the applicable refund will be arranged.",
      "Customers are encouraged to carefully review their order details before completing payment.",
    ],
  },
  {
    n: "9",
    title: "Agricultural Information",
    body: [
      "Agricultural articles, guides, recommendations, and other educational content published on Mkulima Supply are provided for general informational purposes.",
      "Farming outcomes can vary depending on crop variety, soil conditions, weather, location, management practices, and other factors. Users should seek qualified agricultural advice where appropriate.",
    ],
  },
  {
    n: "10",
    title: "Intellectual Property",
    body: [
      "Unless otherwise stated, content published on this website, including text, graphics, logos, images, and other materials, belongs to Mkulima Supply or its respective licensors and may not be reproduced, distributed, or commercially used without appropriate permission.",
    ],
  },
  {
    n: "11",
    title: "Third-Party Services",
    body: [
      "Certain website functions may depend on third-party services, including payment, hosting, analytics, communications, and advertising providers.",
      "The availability and operation of such services may be subject to the respective provider's terms and policies.",
    ],
  },
  {
    n: "12",
    title: "Changes",
    body: [
      "We may update these Terms & Conditions when necessary. Updated versions will be published on this page.",
    ],
  },
  {
    n: "13",
    title: "Contact",
    body: [
      "If you have questions about these Terms & Conditions, contact Mkulima Supply using the contact information provided on our website.",
      "You may also contact us by phone at +254 746 403931 or visit us in Ongata Rongai, Nairobi, Kenya.",
    ],
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-cream">
      {/* Hero */}
      <section className="relative bg-[var(--green-900)] px-6 pt-16 pb-0 text-[var(--cream)] overflow-hidden">
        <div className="mx-auto max-w-5xl pb-12">
          <h1 className="font-display text-3xl tracking-tight sm:text-4xl">
            Terms & Conditions
          </h1>
          <p className="mt-3 inline-block rounded-full border border-[var(--cream)]/20 px-3 py-1 text-xs text-[var(--cream)]/60">
            Last updated: August 26, 2026
          </p>
        </div>
        <div className="absolute inset-x-0 bottom-0 translate-y-px">
          <Furrows />
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-6 py-14">
        <p className="max-w-2xl leading-7 text-[var(--green-800)]/80">
          These Terms & Conditions govern your use of the Mkulima Supply website
          and the purchase of products through our platform.
        </p>

        <div className="mt-12 grid gap-10 sm:grid-cols-[180px_1fr] sm:gap-12">
          {/* Sticky table of contents */}
          <nav
            aria-label="Sections"
            className="hidden sm:block sm:sticky sm:top-8 sm:self-start"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--earth-500)]">
              On this page
            </p>
            <ol className="mt-4 space-y-2.5">
              {sections.map(({ n, title }) => (
                <li key={n}>
                  <a
                    href={`#section-${n}`}
                    className="flex gap-2 text-sm text-[var(--green-800)]/70 hover:text-[var(--green-700)]"
                  >
                    <span className="text-[var(--earth-500)]">{n}</span>
                    <span>{title}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {/* Clauses */}
          <article className="divide-y divide-[var(--earth-300)]/25">
            {sections.map(({ n, title, body }) => (
              <section
                key={n}
                id={`section-${n}`}
                className="scroll-mt-8 py-8 first:pt-0"
              >
                <h2 className="flex items-baseline gap-3 font-display text-xl text-[var(--green-900)]">
                  <span className="text-sm text-[var(--earth-500)]">{n}</span>
                  {title}
                </h2>
                <div className="mt-3 max-w-2xl space-y-3 leading-7 text-[var(--green-800)]/80">
                  {body.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </section>
            ))}
          </article>
        </div>
      </div>
    </main>
  );
}
