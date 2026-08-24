import React from "react";
import Link from "next/link";
import { Leaf } from "lucide-react";

const Footer = ({ SITE_NAME }: { SITE_NAME: string }) => {
  return (
    <footer className="pt-20 bg-[#0c260c] text-white/70">
      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-transparent rounded-full flex items-center justify-center border-white">
                <Leaf size={16} className="text-white" />
              </div>
              <Link
                href="/"
                className="inline-block text-xl font-bold text-white"
              >
                {SITE_NAME}
              </Link>
            </div>

            <p className="mt-4 max-w-sm text-sm leading-6 text-white/60">
              Quality agricultural inputs and farming resources to help Kenyan
              farmers grow better, smarter, and more profitably.
            </p>

            <div className="mt-5 space-y-2 text-sm">
              <p>📍 Ongata Rongai, Nairobi</p>

              <p>
                📞{" "}
                <a
                  href="tel:+254746403931"
                  className="transition hover:text-white"
                >
                  +254 746 403931
                </a>
              </p>

              <p>
                💬{" "}
                <a
                  href="https://wa.me/254746403931"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-300 transition hover:text-green-200"
                >
                  Chat with us on WhatsApp
                </a>
              </p>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Shop
            </h3>

            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link href="/shop" className="transition hover:text-white">
                  Shop Agricultural Products
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Resources
            </h3>

            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link href="/blog" className="transition hover:text-white">
                  Agriculture Blog
                </Link>
              </li>

              <li>
                <Link href="/about" className="transition hover:text-white">
                  About Us
                </Link>
              </li>

              <li>
                <Link href="/contact" className="transition hover:text-white">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Information
            </h3>

            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link href="/shipping" className="transition hover:text-white">
                  Shipping & Delivery
                </Link>
              </li>

              <li>
                <Link href="/returns" className="transition hover:text-white">
                  Returns & Refunds
                </Link>
              </li>

              <li>
                <Link
                  href="/privacy-policy"
                  className="transition hover:text-white"
                >
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link href="/terms" className="transition hover:text-white">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-5 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p>
            © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>

          <p>Quality agricultural products for Kenyan farmers.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
