"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

interface Category {
  id: string;
  name: string;
  emoji: string;
}
interface ProductForm {
  name: string;
  description: string;
  price: string;
  stock: string;
  emoji: string;
  badge: string;
  featured: boolean;
  categoryId: string;
}

const EMPTY: ProductForm = {
  name: "",
  description: "",
  price: "",
  stock: "",
  emoji: "📦",
  badge: "",
  featured: false,
  categoryId: "",
};

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<ProductForm>(EMPTY);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/products/${id}`).then((r) => r.json()),
      fetch("/api/admin/categories").then((r) => r.json()),
    ]).then(([pd, cd]) => {
      const p = pd.product;
      setForm({
        name: p.name,
        description: p.description,
        price: String(p.price),
        stock: String(p.stock),
        emoji: p.emoji,
        badge: p.badge ?? "",
        featured: p.featured,
        categoryId: p.categoryId,
      });
      setCategories(cd.categories ?? []);
      setLoading(false);
    });
  }, [id]);

  function set(key: keyof ProductForm, val: string | boolean) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function handleSave() {
    if (!form.name || !form.price || !form.categoryId) {
      setError("Name, price, and category are required.");
      return;
    }
    setSaving(true);
    setError("");
    const res = await fetch(`/api/admin/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        badge: form.badge || null,
      }),
    });
    setSaving(false);
    if (res.ok) router.push("/admin/products");
    else {
      const d = await res.json();
      setError(d.error ?? "Failed to save");
    }
  }

  async function handleDelete() {
    if (!confirm(`Delete "${form.name}"? This cannot be undone.`)) return;
    setDeleting(true);
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (res.ok) router.push("/admin/products");
    else {
      const d = await res.json();
      setError(d.error ?? "Failed to delete");
      setDeleting(false);
    }
  }

  if (loading)
    return (
      <div className="p-6 flex items-center gap-2 text-gray-400 text-sm">
        <span className="animate-spin">⏳</span> Loading product…
      </div>
    );

  return (
    <div className="p-6 max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.push("/admin/products")}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 transition-colors text-sm"
        >
          ←
        </button>
        <div>
          <h1 className="text-2xl font-display text-gray-900">Edit product</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Update product details and inventory
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-100 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="bg-white border border-gray-100 rounded-xl divide-y divide-gray-100">
        {/* Basic info */}
        <div className="p-5 space-y-4">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            Basic info
          </p>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-red-400">*</span>
              </label>
              <input
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--green-400)]"
              />
            </div>
            <div className="w-24">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Emoji
              </label>
              <input
                value={form.emoji}
                onChange={(e) => set("emoji", e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg text-center text-lg focus:outline-none focus:ring-2 focus:ring-[var(--green-400)]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[var(--green-400)]"
            />
          </div>
        </div>

        {/* Pricing & stock */}
        <div className="p-5 space-y-4">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            Pricing & stock
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (KES) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                min="0"
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--green-400)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock units
              </label>
              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => set("stock", e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--green-400)]"
              />
            </div>
          </div>
        </div>

        {/* Category & meta */}
        <div className="p-5 space-y-4">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            Category & meta
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-400">*</span>
              </label>
              <select
                value={form.categoryId}
                onChange={(e) => set("categoryId", e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[var(--green-400)]"
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.emoji} {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Badge{" "}
                <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                placeholder="e.g. Bestseller, New…"
                value={form.badge}
                onChange={(e) => set("badge", e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--green-400)]"
              />
            </div>
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer select-none w-fit">
            <div
              onClick={() => set("featured", !form.featured)}
              className={`w-10 h-5 rounded-full transition-colors relative ${form.featured ? "bg-[var(--green-600)]" : "bg-gray-200"}`}
            >
              <span
                className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.featured ? "translate-x-5" : "translate-x-0.5"}`}
              />
            </div>
            <span className="text-sm text-gray-700">Featured product</span>
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mt-5">
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="px-4 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
        >
          {deleting ? "Deleting…" : "Delete product"}
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => router.push("/admin/products")}
            className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 text-sm bg-[var(--green-600)] hover:bg-[var(--green-700)] text-white rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
