// components/admin/Sidebar.tsx
import Link from "next/link";

const links = [
  { name: "Dashboard", href: "/admin" },
  { name: "Products", href: "/admin/products" },
  { name: "Orders", href: "/admin/orders" },
  { name: "Categories", href: "/admin/categories" },
  { name: "Users", href: "/admin/users" },
];

export function Sidebar() {
  return (
    <aside className="w-64 bg-[#163e16] text-white p-6">
      <h2 className="text-xl font-bold mb-8">🌱 Admin</h2>

      <nav className="space-y-3">
        {links.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className="block px-3 py-2 rounded-lg hover:bg-[#1f5e1f]"
          >
            {link.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}