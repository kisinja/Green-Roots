"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "@/components/admin/ImageUploader";

interface Category {
  id: string;
  name: string;
  emoji: string;
}

interface ProductForm {
  name: string;
  description: string;
  longDescription: string;
  features: string;
  plantingSeason: string;
  maturity: string;
  seedType: string;
  farmingMethod: string;
  price: string;
  stock: string;
  emoji: string;
  badge: string;
  featured: boolean;
  categoryId: string;
  images: string[];
}

const INITIAL_FORM: ProductForm = {
  name: "",
  description: "",
  longDescription: "",
  features: "",
  plantingSeason: "",
  maturity: "",
  seedType: "",
  farmingMethod: "",
  price: "",
  stock: "0",
  emoji: "📦",
  badge: "",
  featured: false,
  categoryId: "",
  images: [],
};

export default function NewProductPage() {
  const router = useRouter();
  const [form, setForm] = useState<ProductForm>(INITIAL_FORM);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((data) => {
        setCategories(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load categories");
        setLoading(false);
      });
  }, []);

  function set(key: keyof ProductForm, value: string | boolean | string[]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit() {
    if (!form.name.trim() || !form.price || !form.categoryId) {
      setError("Name, price and category are required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          stock: Number(form.stock),
          badge: form.badge || null,
          features: form.features
            .split("\n")
            .map((f) => f.trim())
            .filter(Boolean),
          specifications: {
            plantingSeason: form.plantingSeason,
            maturity: form.maturity,
            seedType: form.seedType,
            farmingMethod: form.farmingMethod,
          },
          images: form.images,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create product");
      router.push("/admin/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create product");
    } finally {
      setSaving(false);
    }
  }

  if (loading)
    return (
      <div className="flex items-center gap-2 p-6 text-sm text-gray-500">
        <span className="animate-spin">⏳</span> Loading categories...
      </div>
    );

  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto max-w-5xl p-6 md:p-8">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
              <button
                onClick={() => router.push("/admin/products")}
                className="transition-colors hover:text-[var(--green-700)]"
              >
                Products
              </button>
              <span>/</span>
              <span className="text-gray-800">New Product</span>
            </div>
            <h1 className="font-display text-4xl leading-tight text-[var(--green-900)]">
              Create Product
            </h1>
            <p className="mt-2 max-w-xl text-gray-500">
              Add a new agro product with images, specifications, pricing and
              merchandising.
            </p>
          </div>
          <div className="hidden items-center gap-2 rounded-xl border border-[var(--green-100)] bg-[var(--green-50)] px-4 py-2 md:flex">
            <span className="text-lg">🌿</span>
            <span className="text-sm font-medium text-[var(--green-700)]">
              GreenRoots Admin
            </span>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_340px]">
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
              <div className="border-b border-gray-100 px-6 py-5">
                <h2 className="text-lg font-semibold text-gray-900">
                  Basic Information
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Product identity shown to customers.
                </p>
              </div>
              <div className="space-y-5 p-6">
                <div className="grid grid-cols-[1fr_100px] gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Product Name
                    </label>
                    <input
                      value={form.name}
                      onChange={(e) => set("name", e.target.value)}
                      placeholder="e.g. Hybrid Tomato Seeds"
                      className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--green-400)]"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Emoji
                    </label>
                    <input
                      value={form.emoji}
                      onChange={(e) => set("emoji", e.target.value)}
                      className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-center text-2xl focus:outline-none focus:ring-2 focus:ring-[var(--green-400)]"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Short Description
                  </label>
                  <textarea
                    rows={4}
                    value={form.description}
                    onChange={(e) => set("description", e.target.value)}
                    placeholder="Short customer-facing product description..."
                    className="w-full resize-none rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--green-400)]"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Detailed Description
                  </label>
                  <textarea
                    rows={6}
                    value={form.longDescription}
                    onChange={(e) => set("longDescription", e.target.value)}
                    placeholder="Detailed farming/product information..."
                    className="w-full resize-none rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--green-400)]"
                  />
                </div>
              </div>
            </div>

            {/* Images — NEW */}
            <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
              <div className="border-b border-gray-100 px-6 py-5">
                <h2 className="text-lg font-semibold text-gray-900">
                  Product Images
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Upload multiple images. First image is the primary. The emoji
                  is used if no images are added.
                </p>
              </div>
              <div className="p-6">
                <ImageUploader
                  images={form.images}
                  onChange={(urls) => set("images", urls)}
                  emoji={form.emoji}
                />
              </div>
            </div>

            {/* Features */}
            <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
              <div className="border-b border-gray-100 px-6 py-5">
                <h2 className="text-lg font-semibold text-gray-900">
                  Product Features
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Add one feature per line.
                </p>
              </div>
              <div className="p-6">
                <textarea
                  rows={7}
                  value={form.features}
                  onChange={(e) => set("features", e.target.value)}
                  placeholder={`High germination rate\nDisease resistant\nSuitable for all seasons\nHigh yield performance`}
                  className="w-full resize-none rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--green-400)]"
                />
              </div>
            </div>

            {/* Specifications */}
            <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
              <div className="border-b border-gray-100 px-6 py-5">
                <h2 className="text-lg font-semibold text-gray-900">
                  Specifications
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Agricultural details and technical specifications.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">
                {(
                  [
                    ["plantingSeason", "Planting Season", "e.g. All Seasons"],
                    ["maturity", "Maturity", "e.g. 75 Days"],
                    ["seedType", "Seed Type", "e.g. Hybrid F1"],
                    ["farmingMethod", "Farming Method", "e.g. Greenhouse"],
                  ] as const
                ).map(([key, label, placeholder]) => (
                  <div key={key}>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      {label}
                    </label>
                    <input
                      value={form[key]}
                      onChange={(e) => set(key, e.target.value)}
                      placeholder={placeholder}
                      className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--green-400)]"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing */}
            <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
              <div className="border-b border-gray-100 px-6 py-5">
                <h2 className="text-lg font-semibold text-gray-900">
                  Pricing & Inventory
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Price (KES)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                      KES
                    </span>
                    <input
                      type="number"
                      min="0"
                      value={form.price}
                      onChange={(e) => set("price", e.target.value)}
                      className="w-full rounded-2xl border border-gray-200 py-3 pl-14 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--green-400)]"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={(e) => set("stock", e.target.value)}
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--green-400)]"
                  />
                </div>
              </div>
            </div>

            {/* Product Settings */}
            <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
              <div className="border-b border-gray-100 px-6 py-5">
                <h2 className="text-lg font-semibold text-gray-900">
                  Product Settings
                </h2>
              </div>
              <div className="space-y-5 p-6">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Category
                    </label>
                    <select
                      value={form.categoryId}
                      onChange={(e) => set("categoryId", e.target.value)}
                      className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--green-400)]"
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
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Badge
                    </label>
                    <input
                      value={form.badge}
                      onChange={(e) => set("badge", e.target.value)}
                      placeholder="e.g. Bestseller"
                      className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--green-400)]"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 px-4 py-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Featured Product
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Highlight this product prominently on the storefront.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => set("featured", !form.featured)}
                    className={`relative h-7 w-14 rounded-full transition-colors ${form.featured ? "bg-[var(--green-600)]" : "bg-gray-300"}`}
                  >
                    <span
                      className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-md transition-transform ${form.featured ? "translate-x-8" : "translate-x-1"}`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Sidebar */}
          <div className="space-y-6">
            <div className="sticky top-6 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
              <div className="border-b border-gray-100 px-6 py-5">
                <h2 className="text-lg font-semibold text-gray-900">
                  Product Preview
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Live storefront appearance
                </p>
              </div>
              <div className="p-6">
                <PreviewCard form={form} categories={categories} />
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={() => router.push("/admin/products")}
            className="rounded-2xl border border-gray-200 px-6 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="rounded-2xl bg-[var(--green-600)] px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--green-700)] disabled:opacity-50"
          >
            {saving ? "Creating…" : "Create Product"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Inline preview card with image carousel ── */
function PreviewCard({ form, categories }: { form: any; categories: any[] }) {
  const [idx, setIdx] = useState(0);
  const imgs = form.images as string[];
  const hasImages = imgs.length > 0;

  return (
    <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white">
      {/* Image/emoji area */}
      <div className="relative flex aspect-[4/3] items-center justify-center bg-[var(--green-50)]">
        {hasImages ? (
          <>
            <img
              src={imgs[idx]}
              alt=""
              className="h-full w-full object-cover"
            />
            {imgs.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setIdx((i) => (i - 1 + imgs.length) % imgs.length)
                  }
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 px-2 py-1 text-xs shadow hover:bg-white"
                >
                  ‹
                </button>
                <button
                  onClick={() => setIdx((i) => (i + 1) % imgs.length)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 px-2 py-1 text-xs shadow hover:bg-white"
                >
                  ›
                </button>
                <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
                  {imgs.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setIdx(i)}
                      className={`h-1.5 rounded-full transition-all ${i === idx ? "w-4 bg-[var(--green-600)]" : "w-1.5 bg-white/70"}`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <span className="text-6xl">{form.emoji || "📦"}</span>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold leading-tight text-gray-900">
              {form.name || "Product Name"}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {categories.find((c) => c.id === form.categoryId)?.name}
            </p>
          </div>
          {form.badge && (
            <span className="rounded-full border border-[var(--green-100)] bg-[var(--green-50)] px-2.5 py-1 text-xs font-semibold text-[var(--green-700)]">
              {form.badge}
            </span>
          )}
        </div>
        <div className="mt-5">
          <p className="text-xs uppercase tracking-wide text-gray-400">Price</p>
          <p className="text-2xl font-bold text-[var(--green-700)]">
            {form.price
              ? `KES ${Number(form.price).toLocaleString()}`
              : "KES 0"}
          </p>
        </div>
        {form.features && (
          <div className="mt-5 border-t border-gray-100 pt-5">
            <p className="mb-3 text-xs uppercase tracking-wide text-gray-400">
              Features
            </p>
            <div className="space-y-2">
              {form.features
                .split("\n")
                .filter(Boolean)
                .slice(0, 4)
                .map((f: string, i: number) => (
                  <div key={i} className="flex gap-2 text-sm text-gray-600">
                    <span className="text-[var(--green-600)]">✓</span>
                    <span>{f}</span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
