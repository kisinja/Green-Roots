"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
}
interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  emoji: string;
  badge: string | null;
  featured: boolean;
  category: Category;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [stockFilter, setStockFilter] = useState("");
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  useEffect(() => {
    fetch("/api/admin/products")
      .then((r) => r.json())
      .then((d) => {
        setProducts(d.products ?? []);
        setLoading(false);
      });
  }, []);

  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category.name))].sort(),
    [products],
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return products.filter((p) => {
      const matchQ =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.category.name.toLowerCase().includes(q);
      const matchC = !catFilter || p.category.name === catFilter;
      const matchS =
        !stockFilter ||
        (stockFilter === "ok" && p.stock > 5) ||
        (stockFilter === "low" && p.stock > 0 && p.stock <= 5) ||
        (stockFilter === "out" && p.stock === 0);
      return matchQ && matchC && matchS;
    });
  }, [products, search, catFilter, stockFilter]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const slice = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const stats = useMemo(
    () => ({
      total: products.length,
      inStock: products.filter((p) => p.stock > 5).length,
      lowStock: products.filter((p) => p.stock > 0 && p.stock <= 5).length,
      featured: products.filter((p) => p.featured).length,
    }),
    [products],
  );

  function stockStyle(stock: number) {
    if (stock === 0) return "text-red-600 font-medium";
    if (stock <= 5) return "text-amber-600 font-medium";
    return "text-[var(--green-600)] font-medium";
  }
  function stockLabel(stock: number) {
    if (stock === 0) return "Out of stock";
    if (stock <= 5) return `Low (${stock})`;
    return `${stock} units`;
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display text-gray-900">Products</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage your agrovet inventory
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-1.5 px-4 py-2 bg-[var(--green-600)] hover:bg-[var(--green-700)] text-white text-sm font-medium rounded-lg transition-colors"
        >
          + Add product
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          {
            label: "Total products",
            value: stats.total,
            color: "text-gray-900",
          },
          {
            label: "In stock",
            value: stats.inStock,
            color: "text-[var(--green-600)]",
          },
          {
            label: "Low stock",
            value: stats.lowStock,
            color: "text-amber-600",
          },
          { label: "Featured", value: stats.featured, color: "text-gray-900" },
        ].map((s) => (
          <div key={s.label} className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">
              {s.label}
            </p>
            <p className={`text-2xl font-medium ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex gap-2 mb-3">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
            🔍
          </span>
          <input
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[var(--green-400)]"
            placeholder="Search products…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <select
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none"
          value={catFilter}
          onChange={(e) => {
            setCatFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none"
          value={stockFilter}
          onChange={(e) => {
            setStockFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All stock</option>
          <option value="ok">In stock</option>
          <option value="low">Low stock (≤5)</option>
          <option value="out">Out of stock</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {["Product", "Price (KES)", "Stock", "Category", "Badge", ""].map(
                (h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wide"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-gray-400">
                  Loading…
                </td>
              </tr>
            ) : slice.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-gray-400">
                  No products found
                </td>
              </tr>
            ) : (
              slice.map((p) => (
                <tr
                  key={p.id}
                  className="border-t border-gray-50 hover:bg-gray-50/60 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-[var(--green-50)] flex items-center justify-center text-lg flex-shrink-0">
                        {p.emoji}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{p.name}</p>
                        <p className="text-xs text-gray-400">{p.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {p.price.toLocaleString()}
                  </td>
                  <td className={`px-4 py-3 ${stockStyle(p.stock)}`}>
                    {stockLabel(p.stock)}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--green-100)] text-[var(--green-700)]">
                      {p.category.name}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {p.badge ? (
                      <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
                        {p.badge}
                      </span>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <Link
                        href={`/admin/products/${p.id}/edit`}
                        className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors text-sm"
                      >
                        ✏️
                      </Link>
                      <button className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 text-gray-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors text-sm">
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 text-xs text-gray-400">
          <span>
            {filtered.length === 0
              ? "No results"
              : `Showing ${(page - 1) * PER_PAGE + 1}–${Math.min(page * PER_PAGE, filtered.length)} of ${filtered.length}`}
          </span>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-7 h-7 rounded-md text-xs border transition-colors ${
                  page === i + 1
                    ? "bg-[var(--green-600)] text-white border-[var(--green-600)]"
                    : "border-gray-200 text-gray-500 hover:bg-gray-50"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
