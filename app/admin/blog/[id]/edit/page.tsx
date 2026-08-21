// app/admin/blog/[id]/edit/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ImageUploader from '@/components/admin/ImageUploader';
import MarkdownRenderer from '@/components/blog/MarkdownRenderer';
import { showToast } from '@/components/ui/Toaster';

interface BlogForm {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  published: boolean;
  featured: boolean;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  readTime: number;
}

export default function EditBlogPost({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();

  const [id, setId] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [keywordInput, setKeywordInput] = useState('');

  const [form, setForm] = useState<BlogForm>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImage: '',
    published: false,
    featured: false,
    tags: [],
    seoTitle: '',
    seoDescription: '',
    seoKeywords: [],
    readTime: 0,
  });

  const [coverImages, setCoverImages] = useState<string[]>([]);
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  /*
   * Calculate estimated reading time.
   * Average reading speed: 200 words/minute.
   */
  const calculateReadTime = (content: string) => {
    const cleanText = content
      .replace(/```[\s\S]*?```/g, ' ')
      .replace(/[#*_`~>\-[\]()]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) return 0;

    const wordCount = cleanText.split(' ').filter(Boolean).length;

    return Math.max(1, Math.ceil(wordCount / 200));
  };

  /*
   * Resolve params and fetch article
   */
  useEffect(() => {
    let mounted = true;

    async function initialize() {
      try {
        const resolvedParams = await params;
        const postId = resolvedParams.id;

        if (!mounted) return;

        setId(postId);

        const res = await fetch(`/api/admin/blog/${postId}`);

        if (!res.ok) {
          if (res.status === 404) {
            setNotFound(true);
          }

          throw new Error('Failed to fetch blog post');
        }

        const post = await res.json();

        if (!mounted) return;

        const content = post.content || '';

        setForm({
          title: post.title || '',
          slug: post.slug || '',
          excerpt: post.excerpt || '',
          content,
          coverImage: post.coverImage || '',
          published: post.published ?? false,
          featured: post.featured ?? false,
          tags: Array.isArray(post.tags) ? post.tags : [],
          seoTitle: post.seoTitle || '',
          seoDescription: post.seoDescription || '',
          seoKeywords: Array.isArray(post.seoKeywords)
            ? post.seoKeywords
            : [],
          readTime:
            typeof post.readTime === 'number'
              ? post.readTime
              : calculateReadTime(content),
        });

        if (post.coverImage) {
          setCoverImages([post.coverImage]);
        }
      } catch (error) {
        console.error('Failed to fetch post:', error);

        if (mounted && !notFound) {
          showToast('Failed to load article', 'error');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    initialize();

    return () => {
      mounted = false;
    };
  }, [params]);

  /*
   * Keep coverImage in sync with ImageUploader
   */
  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      coverImage: coverImages[0] || '',
    }));
  }, [coverImages]);

  /*
   * Generic form updater
   */
  const updateForm = <K extends keyof BlogForm>(
    field: K,
    value: BlogForm[K]
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /*
   * Add regular tag
   */
  const addTag = (value?: string) => {
    const tag = (value ?? tagInput).trim();

    if (!tag) return;

    const normalizedTag = tag.toLowerCase();

    if (!form.tags.some((item) => item.toLowerCase() === normalizedTag)) {
      updateForm('tags', [...form.tags, tag]);
    }

    setTagInput('');
  };

  /*
   * Remove regular tag
   */
  const removeTag = (tagToRemove: string) => {
    updateForm(
      'tags',
      form.tags.filter((tag) => tag !== tagToRemove)
    );
  };

  /*
   * Add SEO keyword
   */
  const addKeyword = (value?: string) => {
    const keyword = (value ?? keywordInput).trim();

    if (!keyword) return;

    const normalizedKeyword = keyword.toLowerCase();

    if (
      !form.seoKeywords.some(
        (item) => item.toLowerCase() === normalizedKeyword
      )
    ) {
      updateForm('seoKeywords', [...form.seoKeywords, keyword]);
    }

    setKeywordInput('');
  };

  /*
   * Remove SEO keyword
   */
  const removeKeyword = (keywordToRemove: string) => {
    updateForm(
      'seoKeywords',
      form.seoKeywords.filter((keyword) => keyword !== keywordToRemove)
    );
  };

  /*
   * Handle tag keyboard input
   */
  const handleTagKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  /*
   * Handle SEO keyword keyboard input
   */
  const handleKeywordKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addKeyword();
    }
  };

  /*
   * Update content + reading time
   */
  const handleContentChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const content = e.target.value;

    setForm((prev) => ({
      ...prev,
      content,
      readTime: calculateReadTime(content),
    }));
  };

  /*
   * Submit update
   */
  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!id) return;

    if (!form.title.trim()) {
      showToast('Please enter an article title', 'error');
      return;
    }

    if (!form.slug.trim()) {
      showToast('Please enter a slug', 'error');
      return;
    }

    if (!form.content.trim()) {
      showToast('Please enter article content', 'error');
      return;
    }

    setSaving(true);

    try {
      const payload = {
        ...form,
        title: form.title.trim(),
        slug: form.slug.trim(),
        excerpt: form.excerpt.trim(),
        seoTitle: form.seoTitle.trim() || null,
        seoDescription: form.seoDescription.trim() || null,
        readTime: calculateReadTime(form.content),
      };

      const res = await fetch(`/api/admin/blog/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showToast('Blog post updated successfully!', 'success');
        router.push('/admin/blog');
        router.refresh();
      } else {
        let errorMessage = 'Failed to update post';

        try {
          const errorData = await res.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          // Ignore JSON parsing error
        }

        showToast(errorMessage, 'error');
      }
    } catch (error) {
      console.error('Error updating blog post:', error);
      showToast('Error updating post', 'error');
    } finally {
      setSaving(false);
    }
  };

  /*
   * Loading state
   */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#fefcf8] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-200 border-t-green-700 rounded-full animate-spin mx-auto mb-4" />

          <p className="text-green-700 font-medium">
            Loading article...
          </p>
        </div>
      </div>
    );
  }

  /*
   * Not found state
   */
  if (notFound) {
    return (
      <div className="min-h-screen bg-[#fefcf8] flex items-center justify-center px-6">
        <div className="text-center">
          <div className="text-6xl mb-6">🌾</div>

          <h1 className="text-3xl font-playfair text-green-900 mb-3">
            Article not found
          </h1>

          <p className="text-gray-500 mb-6">
            The article you are trying to edit does not exist.
          </p>

          <button
            onClick={() => router.push('/admin/blog')}
            className="px-6 py-3 bg-green-700 hover:bg-green-800 text-white rounded-2xl transition"
          >
            ← Back to Articles
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fefcf8]">
      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">
          <div>
            <button
              type="button"
              onClick={() => router.push('/admin/blog')}
              className="text-sm text-green-700 hover:text-green-900 mb-3 transition"
            >
              ← Back to Articles
            </button>

            <h1 className="text-4xl lg:text-5xl font-playfair text-green-900">
              Edit Article
            </h1>

            <p className="text-gray-500 mt-2">
              Update your agricultural content and SEO settings.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setPreview(!preview)}
              className="px-6 py-3 border border-green-600 text-green-700 rounded-2xl hover:bg-green-50 transition"
            >
              {preview ? '✍️ Edit Mode' : '👁️ Preview'}
            </button>

            <button
              type="button"
              onClick={() => handleSubmit()}
              disabled={saving || !form.title.trim()}
              className="bg-green-700 hover:bg-green-800 disabled:bg-green-300 text-white px-8 py-3 rounded-2xl font-medium transition"
            >
              {saving ? 'Saving...' : '💾 Update Article'}
            </button>
          </div>
        </div>

        <div
          className={`grid grid-cols-1 ${
            preview ? 'lg:grid-cols-5' : ''
          } gap-10`}
        >
          {/* ============================================================
              EDITOR
          ============================================================ */}
          <form
            onSubmit={handleSubmit}
            className={preview ? 'lg:col-span-3' : 'w-full'}
          >
            <div className="space-y-8">
              {/* ========================================================
                  BASIC INFORMATION
              ======================================================== */}
              <section className="bg-white border border-green-100 rounded-3xl p-6 lg:p-8 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-2xl font-playfair text-green-900">
                    Article Details
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Basic information about your article.
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-green-700 mb-2">
                      Article Title
                    </label>

                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) =>
                        updateForm('title', e.target.value)
                      }
                      placeholder="Enter article title..."
                      className="w-full px-6 py-4 border border-green-200 rounded-2xl bg-[#fefcf8] focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition"
                    />
                  </div>

                  {/* Slug */}
                  <div>
                    <label className="block text-sm font-medium text-green-700 mb-2">
                      Slug
                    </label>

                    <input
                      type="text"
                      value={form.slug}
                      onChange={(e) =>
                        updateForm('slug', e.target.value)
                      }
                      placeholder="article-url-slug"
                      className="w-full px-6 py-4 border border-green-200 rounded-2xl bg-[#fefcf8] focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition font-mono text-sm"
                    />

                    <p className="text-xs text-gray-400 mt-2">
                      Used as the article URL.
                    </p>
                  </div>

                  {/* Excerpt */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-green-700">
                        Excerpt
                      </label>

                      <span className="text-xs text-gray-400">
                        {form.excerpt.length}/300
                      </span>
                    </div>

                    <textarea
                      value={form.excerpt}
                      maxLength={300}
                      onChange={(e) =>
                        updateForm('excerpt', e.target.value)
                      }
                      rows={4}
                      placeholder="Write a short summary of the article..."
                      className="w-full px-6 py-4 border border-green-200 rounded-2xl bg-[#fefcf8] focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition resize-none"
                    />
                  </div>

                  {/* Cover Image */}
                  <div>
                    <label className="block text-sm font-medium text-green-700 mb-3">
                      Cover Image
                    </label>

                    <ImageUploader
                      images={coverImages}
                      onChange={setCoverImages}
                      emoji="🌾"
                    />
                  </div>
                </div>
              </section>

              {/* ========================================================
                  CONTENT
              ======================================================== */}
              <section className="bg-white border border-green-100 rounded-3xl p-6 lg:p-8 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                  <div>
                    <h2 className="text-2xl font-playfair text-green-900">
                      Article Content
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      Write your article using Markdown.
                    </p>
                  </div>

                  <div className="px-4 py-2 bg-green-50 rounded-xl text-sm text-green-700">
                    📖 ~{form.readTime || 0} min read
                  </div>
                </div>

                <textarea
                  value={form.content}
                  onChange={handleContentChange}
                  placeholder={`# Your Article Title

Start writing your article here...

## Introduction

Write your introduction here.

## Main Section

Add useful information for farmers...

### Subsection

Add more details here.`}
                  rows={28}
                  className="w-full px-6 py-5 border border-green-200 rounded-2xl bg-[#fefcf8] focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition resize-y font-mono text-sm leading-7"
                />

                <div className="flex flex-wrap justify-between gap-3 mt-3 text-xs text-gray-400">
                  <span>
                    Markdown supported
                  </span>

                  <span>
                    {form.content.trim()
                      ? `${form.content.trim().split(/\s+/).length} words`
                      : '0 words'}
                  </span>
                </div>
              </section>

              {/* ========================================================
                  PUBLISHING
              ======================================================== */}
              <section className="bg-white border border-green-100 rounded-3xl p-6 lg:p-8 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-2xl font-playfair text-green-900">
                    Publishing
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Control how this article appears on your website.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Published */}
                  <label className="flex items-center justify-between gap-6 p-5 border border-green-100 rounded-2xl hover:bg-green-50/50 transition cursor-pointer">
                    <div>
                      <p className="font-medium text-green-900">
                        Published
                      </p>

                      <p className="text-sm text-gray-500 mt-1">
                        Make this article visible to website visitors.
                      </p>
                    </div>

                    <input
                      type="checkbox"
                      checked={form.published}
                      onChange={(e) =>
                        updateForm(
                          'published',
                          e.target.checked
                        )
                      }
                      className="w-5 h-5 accent-green-700 cursor-pointer"
                    />
                  </label>

                  {/* Featured */}
                  <label className="flex items-center justify-between gap-6 p-5 border border-green-100 rounded-2xl hover:bg-green-50/50 transition cursor-pointer">
                    <div>
                      <p className="font-medium text-green-900">
                        Featured Article
                      </p>

                      <p className="text-sm text-gray-500 mt-1">
                        Highlight this article in featured sections.
                      </p>
                    </div>

                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={(e) =>
                        updateForm(
                          'featured',
                          e.target.checked
                        )
                      }
                      className="w-5 h-5 accent-green-700 cursor-pointer"
                    />
                  </label>
                </div>
              </section>

              {/* ========================================================
                  TAGS
              ======================================================== */}
              <section className="bg-white border border-green-100 rounded-3xl p-6 lg:p-8 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-2xl font-playfair text-green-900">
                    Tags
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Add topics that help organize your articles.
                  </p>
                </div>

                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) =>
                    setTagInput(e.target.value)
                  }
                  onKeyDown={handleTagKeyDown}
                  placeholder="Type a tag and press Enter..."
                  className="w-full px-5 py-4 border border-green-200 rounded-2xl bg-[#fefcf8] focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition"
                />

                {form.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {form.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-800 rounded-full text-sm border border-green-100"
                      >
                        #{tag}

                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-green-600 hover:text-red-600 transition font-bold"
                          aria-label={`Remove ${tag}`}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {form.tags.length === 0 && (
                  <p className="text-xs text-gray-400 mt-3">
                    No tags added yet.
                  </p>
                )}
              </section>

              {/* ========================================================
                  SEO
              ======================================================== */}
              <section className="bg-white border border-green-100 rounded-3xl p-6 lg:p-8 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-2xl font-playfair text-green-900">
                    SEO Settings
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Optimize how your article appears in search
                    engines.
                  </p>
                </div>

                <div className="space-y-6">
                  {/* SEO Title */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-green-700">
                        SEO Title
                      </label>

                      <span
                        className={`text-xs ${
                          form.seoTitle.length > 60
                            ? 'text-red-500'
                            : 'text-gray-400'
                        }`}
                      >
                        {form.seoTitle.length}/60
                      </span>
                    </div>

                    <input
                      type="text"
                      maxLength={60}
                      value={form.seoTitle}
                      onChange={(e) =>
                        updateForm(
                          'seoTitle',
                          e.target.value
                        )
                      }
                      placeholder={
                        form.title ||
                        'SEO optimized article title'
                      }
                      className="w-full px-5 py-4 border border-green-200 rounded-2xl bg-[#fefcf8] focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition"
                    />
                  </div>

                  {/* SEO Description */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-green-700">
                        SEO Description
                      </label>

                      <span
                        className={`text-xs ${
                          form.seoDescription.length > 160
                            ? 'text-red-500'
                            : 'text-gray-400'
                        }`}
                      >
                        {form.seoDescription.length}/160
                      </span>
                    </div>

                    <textarea
                      maxLength={160}
                      rows={4}
                      value={form.seoDescription}
                      onChange={(e) =>
                        updateForm(
                          'seoDescription',
                          e.target.value
                        )
                      }
                      placeholder={
                        form.excerpt ||
                        'Short description for search engines...'
                      }
                      className="w-full px-5 py-4 border border-green-200 rounded-2xl bg-[#fefcf8] focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition resize-none"
                    />
                  </div>

                  {/* SEO Keywords */}
                  <div>
                    <label className="block text-sm font-medium text-green-700 mb-2">
                      SEO Keywords
                    </label>

                    <input
                      type="text"
                      value={keywordInput}
                      onChange={(e) =>
                        setKeywordInput(e.target.value)
                      }
                      onKeyDown={handleKeywordKeyDown}
                      placeholder="e.g. maize farming, fertilizers, Kenya"
                      className="w-full px-5 py-4 border border-green-200 rounded-2xl bg-[#fefcf8] focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition"
                    />

                    {form.seoKeywords.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {form.seoKeywords.map((keyword) => (
                          <span
                            key={keyword}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-800 rounded-full text-sm border border-amber-100"
                          >
                            {keyword}

                            <button
                              type="button"
                              onClick={() =>
                                removeKeyword(keyword)
                              }
                              className="text-amber-600 hover:text-red-600 transition font-bold"
                              aria-label={`Remove ${keyword}`}
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}

                    <p className="text-xs text-gray-400 mt-3">
                      Press Enter or comma to add a keyword.
                    </p>
                  </div>

                  {/* Search Preview */}
                  <div className="border border-green-100 rounded-2xl p-5 bg-[#fefcf8]">
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">
                      Search Preview
                    </p>

                    <p className="text-lg text-blue-700 font-medium truncate">
                      {form.seoTitle ||
                        form.title ||
                        'Your article title'}
                    </p>

                    <p className="text-sm text-green-700 mt-1">
                      mkulimasupply.store/blog/
                      {form.slug || 'article-slug'}
                    </p>

                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                      {form.seoDescription ||
                        form.excerpt ||
                        'Your article description will appear here.'}
                    </p>
                  </div>
                </div>
              </section>

              {/* ========================================================
                  SAVE BUTTON
              ======================================================== */}
              <div className="flex justify-end gap-3 pb-10">
                <button
                  type="button"
                  onClick={() => router.push('/admin/blog')}
                  className="px-6 py-3 border border-gray-200 text-gray-600 rounded-2xl hover:bg-gray-50 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving || !form.title.trim()}
                  className="bg-green-700 hover:bg-green-800 disabled:bg-green-300 text-white px-8 py-3 rounded-2xl font-medium transition"
                >
                  {saving
                    ? 'Saving...'
                    : '💾 Update Article'}
                </button>
              </div>
            </div>
          </form>

          {/* ============================================================
              LIVE PREVIEW
          ============================================================ */}
          {preview && (
            <aside className="lg:col-span-2">
              <div className="border border-green-100 rounded-3xl p-6 lg:p-8 bg-white sticky top-8 max-h-[calc(100vh-4rem)] overflow-auto shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-xs font-medium text-green-600 uppercase tracking-wider">
                      Live Preview
                    </p>

                    <p className="text-sm text-gray-400 mt-1">
                      Reader view
                    </p>
                  </div>

                  <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs">
                    ~{form.readTime || 0} min read
                  </span>
                </div>

                {form.coverImage && (
                  <img
                    src={form.coverImage}
                    alt={form.title || 'Cover image'}
                    className="w-full h-64 object-cover rounded-2xl mb-8 shadow-md"
                  />
                )}

                {!form.coverImage && (
                  <div className="w-full h-64 rounded-2xl mb-8 bg-green-50 flex items-center justify-center text-6xl">
                    🌾
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mb-5">
                  {form.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-3 py-1 bg-green-50 text-green-700 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <h1 className="font-playfair text-4xl leading-tight text-green-900 mb-4">
                  {form.title || 'Your Article Title'}
                </h1>

                {form.excerpt && (
                  <p className="text-gray-500 text-lg leading-relaxed mb-8">
                    {form.excerpt}
                  </p>
                )}

                <div className="border-t border-green-100 pt-8">
                  <MarkdownRenderer
                    content={
                      form.content ||
                      'Start writing your article to see the preview here...'
                    }
                  />
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}