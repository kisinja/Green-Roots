import type { Metadata } from 'next'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { CartDrawer } from '@/components/shop/CartDrawer'
import { Toaster } from '@/components/ui/Toaster'

export const metadata: Metadata = {
  title: 'GreenRoots Agrovet | Quality Farm Inputs Kenya',
  description: 'Buy certified seeds, fertilisers, pesticides and veterinary supplies online. Serving Kenya with quality farm inputs. Pay via M-Pesa.',
  keywords: 'agrovet kenya, farm inputs, seeds, fertiliser, pesticides, mpesa, nairobi',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-[#fefcf8] text-gray-900 antialiased">
        <Navbar />
        <main>{children}</main>
        <CartDrawer />
        <Toaster />
        <footer className="bg-[#0c260c] text-white/60 py-8 text-center text-sm mt-16">
          <p className="font-semibold text-white/90 text-base mb-1">GreenRoots Agrovet</p>
          <p>📍 Ongata Rongai, Nairobi &nbsp;·&nbsp; 📞 0700 000 000 &nbsp;·&nbsp;
            <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WA_NUMBER || '254700000000'}`}
               className="text-green-300 hover:text-green-200" target="_blank" rel="noopener">
              WhatsApp
            </a>
          </p>
          <p className="text-xs mt-3 opacity-40">© {new Date().getFullYear()} GreenRoots Agrovet. All rights reserved.</p>
        </footer>
      </body>
    </html>
  )
}
