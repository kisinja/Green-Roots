import type { Metadata } from 'next'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { CartDrawer } from '@/components/shop/CartDrawer'
import { Toaster } from '@/components/ui/Toaster'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://mkulimasupply.store'
const SITE_NAME = 'Mkulima Supply Store Agrovet'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Mkulima Supply Store Agrovet | Quality Farm Inputs Kenya',
    template: `%s | ${SITE_NAME}`,
  },
  description:
    'Buy certified seeds, fertilisers, pesticides and veterinary supplies online. Serving Kenya with quality farm inputs. Fast delivery. Pay via M-Pesa.',
  keywords: [
    'agrovet Kenya',
    'farm inputs Kenya',
    'buy seeds online Kenya',
    'fertiliser Kenya',
    'pesticides Kenya',
    'veterinary supplies Kenya',
    'KEPHIS certified seeds',
    'agrovet Nairobi',
    'agrovet Ongata Rongai',
    'M-Pesa agrovet',
    'online agrovet Kenya',
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  alternates: {
    canonical: SITE_URL,
    languages: { 'en-KE': SITE_URL },
  },
  openGraph: {
    type: 'website',
    locale: 'en_KE',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: 'Mkulima Supply Store Agrovet | Quality Farm Inputs Kenya',
    description:
      'Buy certified seeds, fertilisers, pesticides and veterinary supplies online. Fast delivery across Kenya. Pay via M-Pesa.',
    images: [
      {
        url: '/og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'Mkulima Supply Store Agrovet – Quality Farm Inputs Kenya',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mkulima Supply Store Agrovet | Quality Farm Inputs Kenya',
    description:
      'Certified seeds, fertilisers, pesticides & vet supplies. Delivered across Kenya. Pay via M-Pesa.',
    images: ['/og-default.jpg'],
  },
  verification: {
    google: '89xrs-Q2EEkybfPI-8aroMTs538-sZ6PhSdqmMTU_cg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-KE">
      <head>
        {/* Geo meta tags for local SEO */}
        <meta name="geo.region" content="KE-110" />
        <meta name="geo.placename" content="Ongata Rongai, Nairobi, Kenya" />
        <meta name="geo.position" content="-1.3969;36.7438" />
        <meta name="ICBM" content="-1.3969, 36.7438" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
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
        <footer className="bg-[#0c260c] text-white/60 py-8 text-center text-sm mt-16">
          <p className="font-semibold text-white/90 text-base mb-1">{SITE_NAME}</p>
          <p>
            📍 Ongata Rongai, Nairobi &nbsp;·&nbsp; 📞{' '}
            <a
              href="tel:+254746403931"
              className="hover:text-white"
            >
              +254 746 403931
            </a>{' '}
            &nbsp;·&nbsp;
            <a
              href="https://wa.me/254746403931"
              className="text-green-300 hover:text-green-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp
            </a>
          </p>
          <p className="text-xs mt-3 opacity-40">
            © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
        </footer>
      </body>
    </html>
  )
}
