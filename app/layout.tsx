import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { Toaster } from "@/components/ui/Toaster";
import Footer from "@/components/layout/Footer";
import Script from "next/script";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.mkulimasupply.store";
const SITE_NAME = "Mkulima Supply Store Agrovet";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Mkulima Supply Store Agrovet | Quality Farm Inputs Kenya",
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Buy certified seeds, fertilisers, pesticides and veterinary supplies online. Serving Kenya with quality farm inputs. Fast delivery. Pay via M-Pesa.",
  keywords: [
    "agrovet Kenya",
    "farm inputs Kenya",
    "buy seeds online Kenya",
    "fertiliser Kenya",
    "pesticides Kenya",
    "veterinary supplies Kenya",
    "KEPHIS certified seeds",
    "agrovet Nairobi",
    "agrovet Ongata Rongai",
    "M-Pesa agrovet",
    "online agrovet Kenya",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: {
    canonical: SITE_URL,
    languages: { "en-KE": SITE_URL },
  },
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "Mkulima Supply Store Agrovet | Quality Farm Inputs Kenya",
    description:
      "Buy certified seeds, fertilisers, pesticides and veterinary supplies online. Fast delivery across Kenya. Pay via M-Pesa.",
    images: [
      {
        url: "/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Mkulima Supply Store Agrovet – Quality Farm Inputs Kenya",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mkulima Supply Store Agrovet | Quality Farm Inputs Kenya",
    description:
      "Certified seeds, fertilisers, pesticides & vet supplies. Delivered across Kenya. Pay via M-Pesa.",
    images: ["/og-default.jpg"],
  },
  verification: {
    google: "89xrs-Q2EEkybfPI-8aroMTs538-sZ6PhSdqmMTU_cg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-KE">
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6605189604076634"
          crossOrigin="anonymous"
        />

        {/* Geo meta tags for local SEO */}
        <meta name="geo.region" content="KE-110" />
        <meta name="geo.placename" content="Ongata Rongai, Nairobi, Kenya" />
        <meta name="geo.position" content="-1.3969;36.7438" />
        <meta name="ICBM" content="-1.3969, 36.7438" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#fefcf8] text-gray-900 antialiased">
        <Navbar />
        <main>{children}</main>
        <CartDrawer />
        <Toaster />
        <Footer SITE_NAME={SITE_NAME} />
      </body>
    </html>
  );
}
