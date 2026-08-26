import Furrows from "@/components/layout/furrows";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Mkulima Supply",
  description:
    "Read the Mkulima Supply Privacy Policy and learn how we collect, use, and protect personal information.",
};

const sections = [
  {
    n: "1",
    title: "Information We Collect",
    body: [
      "To create an account and place an order through Mkulima Supply, we collect personal information such as your name, phone number, email address, and delivery address.",
      "We may also collect information relating to your orders, including products purchased, quantities, order status, delivery information, and other information necessary to process and fulfil your order.",
      "We may also collect technical information such as browser type, device information, pages visited, and general usage information when you interact with our website.",
    ],
  },
  {
    n: "2",
    title: "How We Use Information",
    body: ["We may use collected information to:"],
    list: [
      "Create and manage customer accounts.",
      "Process and manage orders.",
      "Arrange delivery of purchased products.",
      "Communicate with customers about their orders.",
      "Provide customer support.",
      "Improve our website, products, and services.",
      "Maintain website security and prevent misuse.",
      "Understand how visitors use our website.",
    ],
  },
  {
    n: "3",
    title: "Payments",
    body: [
      "Mkulima Supply currently accepts payments through M-Pesa using IntaSend. Payment processing is handled through the applicable payment service provider.",
      "Mkulima Supply does not intentionally collect or store sensitive payment credentials such as your M-Pesa PIN.",
      "Payment-related information may be processed by IntaSend in accordance with its applicable terms and privacy practices.",
      "Mkulima Supply does not currently offer cash on delivery. Orders are paid through the available payment method before fulfilment and delivery.",
    ],
  },
  {
    n: "4",
    title: "Cookies and Similar Technologies",
    body: [
      "Our website may use cookies and similar technologies to support website functionality, maintain user sessions, understand website usage, improve the user experience, and maintain website security.",
      "If third-party advertising services such as Google AdSense are enabled, those services may use cookies or similar technologies to provide, personalize, measure, and improve advertising in accordance with their own policies and applicable requirements.",
    ],
  },
  {
    n: "5",
    title: "Third-Party Services",
    body: [
      "We may use trusted third-party services to provide functionality such as payment processing, hosting, analytics, communications, advertising, and other website services.",
      "These third parties may process information according to their own privacy policies and terms. Such services may include IntaSend for payment processing and Google services for analytics or advertising where applicable.",
    ],
  },
  {
    n: "6",
    title: "Data Security",
    body: [
      "We take reasonable technical and organizational measures to protect customer information against unauthorized access, alteration, disclosure, loss, misuse, or destruction.",
      "However, no internet-based service or method of electronic storage can guarantee absolute security.",
    ],
  },
  {
    n: "7",
    title: "Data Retention",
    body: [
      "We retain customer and order information for as long as reasonably necessary to provide our services, manage customer accounts, fulfil orders, maintain business records, meet applicable legal obligations, and resolve disputes.",
    ],
  },
  {
    n: "8",
    title: "Your Rights",
    body: [
      "Depending on applicable law, you may have rights concerning your personal information, including requesting access to or correction of information held about you.",
      "If you have a privacy-related request or believe that information we hold about you is inaccurate, please contact Mkulima Supply using the contact details provided on our Contact page.",
    ],
  },
  {
    n: "9",
    title: "Contact Us",
    body: [
      "For privacy-related questions or requests, contact Mkulima Supply through the contact details provided on our Contact page.",
      "You may also contact us by phone at +254 746 403931 or visit us in Ongata Rongai, Nairobi, Kenya.",
    ],
  },
  {
    n: "10",
    title: "Changes to This Policy",
    body: [
      "We may update this Privacy Policy from time to time to reflect changes to our services, technology, legal requirements, or business practices.",
      "Any changes will be reflected on this page with an updated revision date.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-cream">
      {/* Hero */}
      <section className="relative bg-[var(--green-900)] px-6 pt-16 pb-0 text-[var(--cream)] overflow-hidden">
        <div className="mx-auto max-w-5xl pb-12">
          <h1 className="font-display text-3xl tracking-tight sm:text-4xl">
            Privacy Policy
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
          Mkulima Supply respects your privacy and is committed to protecting
          the personal information you provide when using our website, creating
          an account, placing an order, and using our services.
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
            {sections.map(({ n, title, body, list }) => (
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
                {list && (
                  <ul className="mt-3 max-w-2xl space-y-1.5 leading-7 text-[var(--green-800)]/80">
                    {list.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span
                          className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-[var(--earth-500)]"
                          aria-hidden="true"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </article>
        </div>
      </div>
    </main>
  );
}
