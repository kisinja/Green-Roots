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
      "Depending on how you use our website, we may collect information such as your name, phone number, email address, delivery information, order information, and other information you voluntarily provide.",
      "We may also collect technical information such as browser type, device information, pages visited, and general usage information when you interact with our website.",
    ],
  },
  {
    n: "2",
    title: "How We Use Information",
    body: ["We may use collected information to:"],
    list: [
      "Process and manage orders.",
      "Communicate with customers.",
      "Provide customer support.",
      "Improve our website and services.",
      "Maintain website security.",
      "Understand how visitors use our website.",
    ],
  },
  {
    n: "3",
    title: "Payments",
    body: [
      "Payments may be processed through third-party payment providers. Payment information may therefore be handled according to the privacy policies and terms of those providers.",
      "Mkulima Supply does not intentionally collect or store sensitive payment credentials such as your M-Pesa PIN.",
    ],
  },
  {
    n: "4",
    title: "Cookies and Similar Technologies",
    body: [
      "Our website may use cookies and similar technologies to support functionality, understand website usage, improve the user experience, and, where applicable, support advertising.",
      "If third-party advertising services such as Google AdSense are enabled, those services may use cookies or similar technologies in accordance with their own policies and applicable requirements.",
    ],
  },
  {
    n: "5",
    title: "Third-Party Services",
    body: [
      "We may use trusted third-party services to provide functionality such as payments, analytics, hosting, communications, advertising, and other website services.",
      "These third parties may process information according to their own privacy policies.",
    ],
  },
  {
    n: "6",
    title: "Data Security",
    body: [
      "We take reasonable measures to protect information against unauthorized access, alteration, disclosure, or destruction. However, no internet-based service can guarantee absolute security.",
    ],
  },
  {
    n: "7",
    title: "Data Retention",
    body: [
      "We retain information for as long as reasonably necessary for the purposes described in this policy, including fulfilling orders, providing services, meeting legal obligations, and resolving disputes.",
    ],
  },
  {
    n: "8",
    title: "Your Rights",
    body: [
      "Depending on applicable law, you may have rights concerning your personal information, including requesting access to or correction of information held about you.",
    ],
  },
  {
    n: "9",
    title: "Contact Us",
    body: [
      "For privacy-related questions or requests, contact Mkulima Supply through the contact details provided on our Contact page.",
    ],
  },
  {
    n: "10",
    title: "Changes to This Policy",
    body: [
      "We may update this Privacy Policy from time to time. Any changes will be reflected on this page with an updated revision date.",
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
            Last updated: August 24, 2026
          </p>
        </div>
        <div className="absolute inset-x-0 bottom-0 translate-y-px">
          <Furrows />
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-6 py-14">
        <p className="max-w-2xl leading-7 text-[var(--green-800)]/80">
          Mkulima Supply respects your privacy and is committed to protecting
          the personal information you provide when using our website and
          services.
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
