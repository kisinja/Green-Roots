// app/admin/products/[id]/edit/page.tsx

"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

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

const EMPTY: ProductForm = {
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
    async function loadData() {
      try {
        setLoading(true);

        const [productRes, categoryRes] = await Promise.all([
          fetch(`/api/admin/products/${id}`),
          fetch("/api/admin/categories"),
        ]);

        const productData = await productRes.json();

        const categoryData = await categoryRes.json();

        const p = productData.product;

        const specs = p.specifications || {};

        setForm({
          name: p.name || "",
          description: p.description || "",
          longDescription: p.longDescription || "",

          features: Array.isArray(p.features) ? p.features.join("\n") : "",

          plantingSeason: specs.plantingSeason || "",
          maturity: specs.maturity || "",
          seedType: specs.seedType || "",
          farmingMethod: specs.farmingMethod || "",

          price: String(p.price || ""),
          stock: String(p.stock || 0),

          emoji: p.emoji || "📦",

          badge: p.badge || "",

          featured: Boolean(p.featured),

          categoryId: p.categoryId || "",

          images: Array.isArray(p.images) ? p.images : [],
        });

        setCategories(categoryData || []);
      } catch (err) {
        console.error(err);

        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  function set(key: keyof ProductForm, val: string | boolean | string[]) {
    setForm((prev) => ({
      ...prev,
      [key]: val,
    }));
  }

  async function handleSave() {
    try {
      setError("");

      if (!form.name.trim() || !form.price || !form.categoryId) {
        setError("Name, price and category are required.");

        return;
      }

      setSaving(true);

      const specifications = {
        plantingSeason: form.plantingSeason,
        maturity: form.maturity,
        seedType: form.seedType,
        farmingMethod: form.farmingMethod,
      };

      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          ...form,

          price: Number(form.price),

          stock: Number(form.stock),

          badge: form.badge || null,

          features: form.features
            .split("\n")
            .map((f) => f.trim())
            .filter(Boolean),

          specifications,

          images: form.images,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update product");
      }

      router.push("/admin/products");
    } catch (err) {
      console.error(err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to update product");
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm(`Delete "${form.name}"? This cannot be undone.`)) {
      return;
    }

    try {
      setDeleting(true);

      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete product");
      }

      router.push("/admin/products");
    } catch (err) {
      console.error(err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to delete product");
      }

      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 p-6 text-sm text-gray-500">
        <span className="animate-spin">⏳</span>
        Loading product...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto max-w-6xl p-6 md:p-8">
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

              <span className="text-gray-800">Edit Product</span>
            </div>

            <h1 className="font-display text-4xl leading-tight text-[var(--green-900)]">
              Edit Product
            </h1>

            <p className="mt-2 max-w-xl text-gray-500">
              Update product information, specifications, inventory and media.
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

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
          {/* LEFT */}
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
              <div className="border-b border-gray-100 px-6 py-5">
                <h2 className="text-lg font-semibold text-gray-900">
                  Basic Information
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Main product identity and descriptions.
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
                      className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--green-400)]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Emoji Fallback
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
                    className="w-full resize-none rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--green-400)]"
                  />
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
              <div className="border-b border-gray-100 px-6 py-5">
                <h2 className="text-lg font-semibold text-gray-900">
                  Product Images
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Upload multiple images. The first image becomes the primary
                  storefront image.
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
              </div>

              <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Planting Season
                  </label>

                  <input
                    value={form.plantingSeason}
                    onChange={(e) => set("plantingSeason", e.target.value)}
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--green-400)]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Maturity
                  </label>

                  <input
                    value={form.maturity}
                    onChange={(e) => set("maturity", e.target.value)}
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--green-400)]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Seed Type
                  </label>

                  <input
                    value={form.seedType}
                    onChange={(e) => set("seedType", e.target.value)}
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--green-400)]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Farming Method
                  </label>

                  <input
                    value={form.farmingMethod}
                    onChange={(e) => set("farmingMethod", e.target.value)}
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--green-400)]"
                  />
                </div>
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

                  <input
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={(e) => set("price", e.target.value)}
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--green-400)]"
                  />
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

            {/* Settings */}
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

                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.emoji} {category.name}
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
                      Highlight this product on the storefront.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => set("featured", !form.featured)}
                    className={`relative h-7 w-14 rounded-full transition-colors ${
                      form.featured ? "bg-[var(--green-600)]" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-md transition-transform ${
                        form.featured ? "translate-x-8" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">
            <div className="sticky top-6 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
              <div className="border-b border-gray-100 px-6 py-5">
                <h2 className="text-lg font-semibold text-gray-900">
                  Live Preview
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Storefront appearance preview.
                </p>
              </div>

              <div className="p-6">
                <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white">
                  <div className="relative aspect-[4/3] overflow-hidden bg-[var(--green-50)]">
                    {form.images.length > 0 ? (
                      <Image
                        src={form.images[0]}
                        alt={form.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-7xl">
                        {form.emoji}
                      </div>
                    )}

                    {form.badge && (
                      <div className="absolute left-3 top-3 rounded-full bg-[var(--green-600)] px-3 py-1 text-xs font-semibold text-white shadow-lg">
                        {form.badge}
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <h3 className="line-clamp-2 text-lg font-semibold text-gray-900">
                      {form.name || "Product Name"}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      {categories.find((c) => c.id === form.categoryId)?.name}
                    </p>

                    <div className="mt-4">
                      <p className="text-2xl font-bold text-[var(--green-700)]">
                        {form.price
                          ? `KES ${Number(form.price).toLocaleString()}`
                          : "KES 0"}
                      </p>
                    </div>

                    {form.description && (
                      <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-gray-500">
                        {form.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex items-center justify-between gap-3">
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="rounded-2xl border border-red-200 px-5 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                  >
                    {deleting ? "Deleting..." : "Delete Product"}
                  </button>

                  <div className="flex gap-3">
                    <button
                      onClick={() => router.push("/admin/products")}
                      className="rounded-2xl border border-gray-200 px-5 py-3 text-sm font-medium transition hover:bg-gray-50"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="rounded-2xl bg-[var(--green-600)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--green-700)] disabled:opacity-50"
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
