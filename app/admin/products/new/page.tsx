"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

const INITIAL_FORM: ProductForm = {
  name: "",
  description: "",
  price: "",
  stock: "0",
  emoji: "📦",
  badge: "",
  featured: false,
  categoryId: "",
};

export default function NewProductPage() {
  const router = useRouter();

  const [form, setForm] = useState<ProductForm>(INITIAL_FORM);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCategories() {
      try {
        setLoading(true);

        const res = await fetch("/api/admin/categories");

        if (!res.ok) {
          throw new Error("Failed to load categories");
        }

        const data = await res.json();

        setCategories(Array.isArray(data.categories) ? data.categories : []);
      } catch (err) {
        console.error(err);

        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to load categories");
        }
      } finally {
        setLoading(false);
      }
    }

    loadCategories();
  }, []);

  function set(
    key: keyof ProductForm,
    value: string | boolean
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function handleSubmit() {
    try {
      setError("");

      if (
        !form.name.trim() ||
        !form.price ||
        !form.categoryId
      ) {
        setError(
          "Name, price and category are required."
        );
        return;
      }

      setSaving(true);

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          stock: Number(form.stock),
          badge: form.badge || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || "Failed to create product"
        );
      }

      router.push("/admin/products");
    } catch (err) {
      console.error(err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to create product");
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center gap-2 text-sm text-gray-500">
        <span className="animate-spin">⏳</span>
        Loading categories...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-4xl mx-auto p-6 md:p-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <button
                onClick={() =>
                  router.push("/admin/products")
                }
                className="hover:text-[var(--green-700)] transition-colors"
              >
                Products
              </button>

              <span>/</span>

              <span className="text-gray-800">
                New Product
              </span>
            </div>

            <h1 className="text-4xl font-display text-[var(--green-900)] leading-tight">
              Create product
            </h1>

            <p className="mt-2 text-gray-500 max-w-xl">
              Add a new product to your inventory with
              pricing, stock levels, category assignment and
              featured visibility.
            </p>
          </div>

          <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--green-50)] border border-[var(--green-100)]">
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

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
          {/* Main form */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">
                  Basic information
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Define the product identity customers will
                  see.
                </p>
              </div>

              <div className="p-6 space-y-5">
                <div className="grid grid-cols-[1fr_100px] gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product name
                    </label>

                    <input
                      value={form.name}
                      onChange={(e) =>
                        set("name", e.target.value)
                      }
                      placeholder="e.g. Premium Dairy Meal"
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--green-400)]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Emoji
                    </label>

                    <input
                      value={form.emoji}
                      onChange={(e) =>
                        set("emoji", e.target.value)
                      }
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-center text-2xl focus:outline-none focus:ring-2 focus:ring-[var(--green-400)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>

                  <textarea
                    rows={5}
                    value={form.description}
                    onChange={(e) =>
                      set("description", e.target.value)
                    }
                    placeholder="Describe the product benefits, usage and target customers..."
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 resize-none text-sm focus:outline-none focus:ring-2 focus:ring-[var(--green-400)]"
                  />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">
                  Pricing & inventory
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Manage selling price and stock levels.
                </p>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                      onChange={(e) =>
                        set("price", e.target.value)
                      }
                      className="w-full pl-14 pr-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--green-400)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock quantity
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={(e) =>
                      set("stock", e.target.value)
                    }
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--green-400)]"
                  />
                </div>
              </div>
            </div>

            {/* Category */}
            <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">
                  Product settings
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Organize visibility and merchandising.
                </p>
              </div>

              <div className="p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>

                    <select
                      value={form.categoryId}
                      onChange={(e) =>
                        set("categoryId", e.target.value)
                      }
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--green-400)]"
                    >
                      <option value="">
                        Select category
                      </option>

                      {categories.map((category) => (
                        <option
                          key={category.id}
                          value={category.id}
                        >
                          {category.emoji} {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Badge
                    </label>

                    <input
                      value={form.badge}
                      onChange={(e) =>
                        set("badge", e.target.value)
                      }
                      placeholder="e.g. Bestseller"
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--green-400)]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 px-4 py-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Featured product
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      Show this product prominently on the
                      storefront.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      set("featured", !form.featured)
                    }
                    className={`relative w-14 h-7 rounded-full transition-colors ${
                      form.featured
                        ? "bg-[var(--green-600)]"
                        : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                        form.featured
                          ? "translate-x-8"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Preview */}
          <div className="space-y-6">
            <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden sticky top-6">
              <div className="px-6 py-5 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">
                  Product preview
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Live storefront appearance
                </p>
              </div>

              <div className="p-6">
                <div className="rounded-3xl border border-gray-100 overflow-hidden bg-white">
                  <div className="aspect-[4/3] bg-[var(--green-50)] flex items-center justify-center text-6xl">
                    {form.emoji || "📦"}
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 leading-tight">
                          {form.name || "Product name"}
                        </h3>

                        <p className="text-sm text-gray-500 mt-1">
                          {
                            categories.find(
                              (c) =>
                                c.id === form.categoryId
                            )?.name
                          }
                        </p>
                      </div>

                      {form.badge && (
                        <span className="px-2.5 py-1 rounded-full bg-[var(--green-50)] text-[var(--green-700)] text-xs font-semibold border border-[var(--green-100)]">
                          {form.badge}
                        </span>
                      )}
                    </div>

                    <div className="mt-5 flex items-center justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-gray-400">
                          Price
                        </p>

                        <p className="text-2xl font-bold text-[var(--green-700)]">
                          {form.price
                            ? `KES ${Number(
                                form.price
                              ).toLocaleString()}`
                            : "KES 0"}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-xs uppercase tracking-wide text-gray-400">
                          Stock
                        </p>

                        <p className="text-sm font-medium text-gray-700">
                          {form.stock || 0} units
                        </p>
                      </div>
                    </div>

                    {form.featured && (
                      <div className="mt-5 rounded-2xl bg-[var(--green-600)] text-white text-sm font-medium px-4 py-3 text-center">
                        🌟 Featured Product
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() =>
                      router.push("/admin/products")
                    }
                    className="flex-1 px-4 py-3 rounded-2xl border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleSubmit}
                    disabled={saving}
                    className="flex-1 px-4 py-3 rounded-2xl bg-[var(--green-600)] hover:bg-[var(--green-700)] text-white text-sm font-semibold transition-colors disabled:opacity-50"
                  >
                    {saving
                      ? "Creating..."
                      : "Create product"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}