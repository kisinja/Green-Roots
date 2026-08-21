// app/admin/blog/new/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "@/components/admin/ImageUploader";
import { showToast } from "@/components/ui/Toaster";
import TiptapEditor from "@/components/blog/TiptapEditor";

export default function NewBlogPost() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "",
    published: false,
    featured: false,
    tags: [] as string[],
    seoTitle: "",
    seoDescription: "",
    seoKeywords: [] as string[],
    readTime: "" as string | number,
  });

  const [coverImages, setCoverImages] = useState<string[]>([]);
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);

  useEffect(() => {
    if (coverImages.length > 0) {
      setForm((prev) => ({ ...prev, coverImage: coverImages[0] }));
    } else {
      setForm((prev) => ({ ...prev, coverImage: "" }));
    }
  }, [coverImages]);

  // Auto-generate slug from title, but stop once the user edits it manually
  useEffect(() => {
    if (form.title && !slugTouched) {
      const generatedSlug = form.title
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
      setForm((prev) => ({ ...prev, slug: generatedSlug }));
    }
  }, [form.title, slugTouched]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title.trim() || !form.excerpt.trim() || !form.content.trim()) {
      showToast("Title, excerpt, and content are required", "error");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch("/api/admin/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          readTime: form.readTime ? Number(form.readTime) : undefined,
        }),
      });

      if (res.ok) {
        showToast("Blog post created successfully!", "success");
        router.push("/admin/blog");
      } else {
        const error = await res.json();
        showToast(error.error || "Failed to save post", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Error saving post", "error");
    } finally {
      setSaving(false);
    }
  };

  const addTag = (tag: string) => {
    if (tag && !form.tags.includes(tag)) {
      setForm((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
    }
  };

  const addKeyword = (kw: string) => {
    if (kw && !form.seoKeywords.includes(kw)) {
      setForm((prev) => ({ ...prev, seoKeywords: [...prev.seoKeywords, kw] }));
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8 bg-[#fefcf8]">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-playfair text-green-900">
          Create New Article
        </h1>
        <div className="flex gap-4">
          <button
            onClick={() => setPreview(!preview)}
            className="px-6 py-3 border border-green-600 text-green-700 rounded-2xl hover:bg-green-50 transition"
          >
            {preview ? "✍️ Edit Mode" : "👁️ Preview"}
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving || !form.title}
            className="bg-green-700 hover:bg-green-800 disabled:bg-green-300 text-white px-8 py-3 rounded-2xl font-medium transition"
          >
            {saving
              ? "Publishing..."
              : form.published
                ? "✅ Publish Article"
                : "💾 Save Draft"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* Editor Form */}
        <div className="lg:col-span-3 space-y-8">
          {/* Title & Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-green-700 mb-2">
                Article Title
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-6 py-4 border border-green-200 rounded-2xl focus:outline-none focus:border-green-500"
                placeholder="e.g. Sustainable Farming Techniques 2026"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-green-700 mb-2">
                Slug
              </label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setForm({ ...form, slug: e.target.value });
                }}
                className="w-full px-6 py-4 border border-green-200 rounded-2xl focus:outline-none focus:border-green-500 font-mono text-sm"
              />
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium text-green-700 mb-2">
              Excerpt (Meta Description)
            </label>
            <textarea
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              rows={3}
              className="w-full px-6 py-4 border border-green-200 rounded-2xl focus:outline-none focus:border-green-500"
              placeholder="Short summary for SEO and blog cards..."
            />
          </div>

          {/* Cover Image Uploader */}
          <div>
            <label className="block text-sm font-medium text-green-700 mb-3">
              Cover Image
            </label>
            <ImageUploader
              images={coverImages}
              onChange={setCoverImages}
              emoji="🌾"
              type="blogImage"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-green-700 mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {form.tags.map((tag, i) => (
                <span
                  key={i}
                  className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm flex items-center gap-1"
                >
                  #{tag}
                  <button
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        tags: prev.tags.filter((_, idx) => idx !== i),
                      }))
                    }
                    className="text-green-500 hover:text-red-500"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              placeholder="Type tag and press Enter"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag(e.currentTarget.value.trim());
                  e.currentTarget.value = "";
                }
              }}
              className="w-full px-6 py-4 border border-green-200 rounded-2xl focus:outline-none focus:border-green-500"
            />
          </div>

          {/* Read Time */}
          <div>
            <label className="block text-sm font-medium text-green-700 mb-2">
              Read Time (minutes)
            </label>
            <input
              type="number"
              min={1}
              value={form.readTime}
              onChange={(e) => setForm({ ...form, readTime: e.target.value })}
              className="w-full md:w-48 px-6 py-4 border border-green-200 rounded-2xl focus:outline-none focus:border-green-500"
              placeholder="Auto-estimated if left blank"
            />
          </div>

          {/* SEO Section */}
          <div className="border border-green-100 rounded-3xl p-6 bg-white space-y-6">
            <h3 className="text-lg font-medium text-green-800">SEO Settings</h3>

            <div>
              <label className="block text-sm font-medium text-green-700 mb-2">
                SEO Title
              </label>
              <input
                type="text"
                value={form.seoTitle}
                onChange={(e) => setForm({ ...form, seoTitle: e.target.value })}
                className="w-full px-6 py-4 border border-green-200 rounded-2xl focus:outline-none focus:border-green-500"
                placeholder="Falls back to article title if left blank"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-green-700 mb-2">
                SEO Description
              </label>
              <textarea
                value={form.seoDescription}
                onChange={(e) =>
                  setForm({ ...form, seoDescription: e.target.value })
                }
                rows={2}
                className="w-full px-6 py-4 border border-green-200 rounded-2xl focus:outline-none focus:border-green-500"
                placeholder="Falls back to excerpt if left blank"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-green-700 mb-2">
                SEO Keywords
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {form.seoKeywords.map((kw, i) => (
                  <span
                    key={i}
                    className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm flex items-center gap-1"
                  >
                    {kw}
                    <button
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          seoKeywords: prev.seoKeywords.filter(
                            (_, idx) => idx !== i,
                          ),
                        }))
                      }
                      className="text-green-500 hover:text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                placeholder="Type keyword and press Enter"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addKeyword(e.currentTarget.value.trim());
                    e.currentTarget.value = "";
                  }
                }}
                className="w-full px-6 py-4 border border-green-200 rounded-2xl focus:outline-none focus:border-green-500"
              />
            </div>
          </div>

          {/* Publish Options */}
          <div className="flex gap-8">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) =>
                  setForm({ ...form, published: e.target.checked })
                }
                className="w-5 h-5 accent-green-600"
              />
              <span className="text-green-700">Publish immediately</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) =>
                  setForm({ ...form, featured: e.target.checked })
                }
                className="w-5 h-5 accent-green-600"
              />
              <span className="text-green-700">Feature on homepage</span>
            </label>
          </div>

          {/* Rich Text Editor */}
          <div className="flex flex-col" style={{ minHeight: "660px" }}>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--green-700)" }}
            >
              Article Content
            </label>
            <div className="flex-1">
              <TiptapEditor
                content={form.content}
                onChange={(html) =>
                  setForm((prev) => ({ ...prev, content: html }))
                }
              />
            </div>
            <p className="text-xs mt-2" style={{ color: "var(--green-600)" }}>
              Write your article using the editor above. You can add images,
              headings, lists, etc.
            </p>
          </div>
        </div>

        {/* Live Preview Sidebar */}
        {preview && (
          <div className="lg:col-span-2 border border-green-100 rounded-3xl p-8 bg-white sticky top-8 self-start max-h-[calc(100vh-6rem)] overflow-auto">
            <h3 className="text-xl font-medium mb-6 text-green-800 border-b pb-4">
              Live Preview
            </h3>

            {form.coverImage && (
              <img
                src={form.coverImage}
                alt="Cover preview"
                className="w-full h-64 object-cover rounded-2xl mb-8"
              />
            )}

            <h1 className="font-playfair text-4xl text-green-900 mb-6">
              {form.title || "Untitled Article"}
            </h1>

            {/* Render the actual Tiptap HTML, same as the live post page — 
                NOT MarkdownRenderer, which would show escaped/literal tags */}
            <div
              className="prose prose-green max-w-none"
              dangerouslySetInnerHTML={{
                __html:
                  form.content ||
                  "<p><em>Preview will appear here as you type...</em></p>",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
