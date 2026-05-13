// components/admin/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { name: "Dashboard", href: "/admin", icon: "🏠" },
  { name: "Products", href: "/admin/products", icon: "📦" },
  { name: "Orders", href: "/admin/orders", icon: "🛒" },
  { name: "Categories", href: "/admin/categories", icon: "🗂️" },
  { name: "Users", href: "/admin/users", icon: "👥" },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={[
        // Base styles
        "fixed inset-y-0 left-0 z-30 flex w-64 flex-col bg-[#163e16] text-white",
        "transition-transform duration-300 ease-in-out",
        // Mobile: slide in/out
        open ? "translate-x-0" : "-translate-x-full",
        // Desktop: always visible, static positioning
        "lg:static lg:translate-x-0",
      ].join(" ")}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
        <h2 className="text-xl font-bold tracking-tight">🌱 Admin</h2>
        {/* Close button — mobile only */}
        <button
          onClick={onClose}
          className="p-1.5 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-colors lg:hidden"
          aria-label="Close sidebar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-1">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              onClick={onClose} // auto-close on mobile after navigation
              className={[
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-white/20 text-white"
                  : "text-white/75 hover:bg-white/10 hover:text-white",
              ].join(" ")}
            >
              <span className="text-base leading-none">{link.icon}</span>
              {link.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-white/10">
        <p className="text-xs text-white/40">GreenRoots Agrovet</p>
      </div>
    </aside>
  );
}
