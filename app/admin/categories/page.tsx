"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { showToast } from "@/components/ui/Toaster";

type Category = {
  id: string;
  name: string;
  emoji: string;
  slug: string;
  _count?: {
    products?: number;
  };
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [form, setForm] = useState({
    name: "",
    emoji: "",
  });

  const fetchCategories = async () => {
    setLoading(true);

    const res = await fetch("/api/admin/categories");
    const data = await res.json();

    // API now returns array directly OR safely fallback
    setCategories(Array.isArray(data) ? data : (data.categories ?? []));

    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const createCategory = async () => {
    if (!form.name || !form.emoji) return;

    setCreating(true);

    const isDuplicate = categories.some(
      (c) => c.name.toLowerCase() === form.name.toLowerCase(),
    );

    if (isDuplicate) {
      setForm({ name: "", emoji: "" });
      showToast("Category already exists");
      return;
    }

    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        // 🔥 show real backend message
        throw new Error(data.message || "Failed to create category");
      }

      setForm({ name: "", emoji: "" });
      await fetchCategories();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setCreating(false);
    }
  };

  const deleteCategory = async (id: string) => {
    const res = await fetch(`/api/admin/categories/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) return;

    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20 text-gray-500">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-[#163e16] mb-6">Categories</h1>

      {/* CREATE */}
      <div className="bg-white border rounded-2xl p-4 mb-6 flex gap-3">
        <input
          placeholder="Category name"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          className="border rounded-xl px-3 py-2 flex-1"
        />

        <input
          placeholder="Emoji"
          value={form.emoji}
          onChange={(e) => setForm((f) => ({ ...f, emoji: e.target.value }))}
          className="border rounded-xl px-3 py-2 w-24"
        />

        <button
          onClick={createCategory}
          disabled={creating}
          className="bg-[#2a7a2a] text-white px-4 rounded-xl flex items-center gap-2 disabled:opacity-60"
        >
          {creating ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Plus size={16} />
          )}
          Add
        </button>
      </div>

      {/* LIST */}
      <div className="grid gap-3">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white border rounded-2xl p-4 flex justify-between items-center"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{cat.emoji}</span>

              <div>
                <p className="font-semibold text-[#163e16]">{cat.name}</p>

                <p className="text-xs text-gray-400">
                  {cat._count?.products ?? 0} products
                </p>
              </div>
            </div>

            <button
              onClick={() => {deleteCategory(cat.id); showToast("Category deleted")}}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
