"use client";

import Link from "next/link";
import {
  ShoppingCart,
  Leaf,
  Menu,
  X,
  User,
  LogOut,
  Package,
} from "lucide-react";

import { useCart } from "@/store/cart";
import { useState, useEffect } from "react";

interface SessionUser {
  name: string;
  email: string;
  role: string;
}

export function Navbar() {
  const { count, openCart } = useCart();

  const [mounted, setMounted] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const [user, setUser] = useState<SessionUser | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCartCount(count());

    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setUser(d.user));
  }, [count]);

  useEffect(() => {
    if (mounted) {
      setCartCount(count());
    }
  }, [count, mounted]);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });

    setUser(null);
    setUserMenuOpen(false);

    window.location.href = "/";
  };

  return (
    <header className="bg-[#163e16] sticky top-0 z-50 shadow-md">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <Leaf size={16} className="text-white" />
          </div>

          <div className="hidden sm:block">
            <div
              className="text-white font-semibold text-lg leading-tight"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              GreenRoots
            </div>

            <div className="text-green-300 text-[10px] tracking-widest uppercase leading-tight">
              Agrovet
            </div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <Link
            href="/"
            className="text-white/75 hover:text-white px-3 py-2 rounded-lg hover:bg-white/10 text-sm font-medium transition-all"
          >
            Home
          </Link>

          <Link
            href="/shop"
            className="text-white/75 hover:text-white px-3 py-2 rounded-lg hover:bg-white/10 text-sm font-medium transition-all"
          >
            Shop
          </Link>

          {user?.role === "ADMIN" && (
            <Link
              href="/admin"
              className="text-green-300 hover:text-green-200 px-3 py-2 rounded-lg hover:bg-white/10 text-sm font-medium transition-all"
            >
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={openCart}
            className="relative bg-green-600 hover:bg-green-500 text-white px-3 py-2 rounded-xl flex items-center gap-2 text-sm font-medium transition-all"
          >
            <ShoppingCart size={16} />

            <span className="hidden sm:inline">Cart</span>

            {mounted && cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen((o) => !o)}
                className="flex items-center gap-2 text-white/80 hover:text-white px-3 py-2 rounded-xl hover:bg-white/10 transition-all text-sm"
              >
                <User size={16} />

                <span className="hidden sm:inline">
                  {user.name.split(" ")[0]}
                </span>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-xl border border-gray-100 py-1 w-44 z-50">
                  <Link
                    href="/orders"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Package size={14} />
                    My Orders
                  </Link>

                  {user.role === "ADMIN" && (
                    <Link
                      href="/admin"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-green-700 hover:bg-gray-50"
                    >
                      <Leaf size={14} />
                      Admin Panel
                    </Link>
                  )}

                  <hr className="my-1" />

                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={14} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden sm:block text-white/75 hover:text-white text-sm font-medium px-3 py-2 rounded-xl hover:bg-white/10 transition-all"
            >
              Sign In
            </Link>
          )}

          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="md:hidden text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-all"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-[#1f5e1f] border-t border-white/10 px-4 py-3 space-y-1">
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="block text-white/80 hover:text-white px-3 py-2.5 rounded-lg hover:bg-white/10 text-sm font-medium"
          >
            Home
          </Link>

          <Link
            href="/shop"
            onClick={() => setMenuOpen(false)}
            className="block text-white/80 hover:text-white px-3 py-2.5 rounded-lg hover:bg-white/10 text-sm font-medium"
          >
            Shop
          </Link>

          {user && (
            <Link
              href="/orders"
              onClick={() => setMenuOpen(false)}
              className="block text-white/80 hover:text-white px-3 py-2.5 rounded-lg hover:bg-white/10 text-sm font-medium"
            >
              My Orders
            </Link>
          )}

          {!user && (
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="block text-white/80 hover:text-white px-3 py-2.5 rounded-lg hover:bg-white/10 text-sm font-medium"
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
