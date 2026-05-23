// app/admin/blog/[id]/edit/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ImageUploader from '@/components/admin/ImageUploader';
import MarkdownRenderer from '@/components/blog/MarkdownRenderer';
import { showToast } from '@/components/ui/Toaster';

export default function EditBlogPost({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [id, setId] = useState<string>('');
  
  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImage: '',
    published: false,
    featured: false,
    tags: [] as string[],
    seoTitle: '',
    seoDescription: '',
    seoKeywords: [] as string[],
  });

  const [coverImages, setCoverImages] = useState<string[]>([]);
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Resolve params and fetch post
  useEffect(() => {
    async function initialize() {
      const resolvedParams = await params;
      const postId = resolvedParams.id;
      setId(postId);

      try {
        const res = await fetch(`/api/admin/blog/${postId}`);
        if (res.ok) {
          const post = await res.json();
          
          setForm({
            title: post.title || '',
            slug: post.slug || '',
            excerpt: post.excerpt || '',
            content: post.content || '',
            coverImage: post.coverImage || '',
            published: post.published || false,
            featured: post.featured || false,
            tags: post.tags || [],
            seoTitle: post.seoTitle || '',
            seoDescription: post.seoDescription || '',
            seoKeywords: post.seoKeywords || [],
          });

          if (post.coverImage) {
            setCoverImages([post.coverImage]);
          }
        }
      } catch (err) {
        console.error('Failed to fetch post:', err);
      } finally {
        setLoading(false);
      }
    }

    initialize();
  }, [params]);

  // Sync cover images
  useEffect(() => {
    if (coverImages.length > 0) {
      setForm(prev => ({ ...prev, coverImage: coverImages[0] }));
    } else {
      setForm(prev => ({ ...prev, coverImage: '' }));
    }
  }, [coverImages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    
    setSaving(true);

    try {
      const res = await fetch(`/api/admin/blog/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        showToast('Blog post updated successfully!', "success");
        router.push('/admin/blog');
      } else {
        const errorData = await res.json();
        showToast(errorData.error || 'Failed to update post', "error");
      }
    } catch (err) {
      console.error(err);
      showToast('Error updating post', "error");
    } finally {
      setSaving(false);
    }
  };

  const addTag = (tag: string) => {
    if (tag && !form.tags.includes(tag)) {
      setForm(prev => ({ ...prev, tags: [...prev.tags, tag] }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-green-700">Loading article...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-8 bg-[#fefcf8]">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-playfair text-green-900">Edit Article</h1>
        <div className="flex gap-4">
          <button
            onClick={() => setPreview(!preview)}
            className="px-6 py-3 border border-green-600 text-green-700 rounded-2xl hover:bg-green-50 transition"
          >
            {preview ? '✍️ Edit Mode' : '👁️ Preview'}
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving || !form.title}
            className="bg-green-700 hover:bg-green-800 disabled:bg-green-300 text-white px-8 py-3 rounded-2xl font-medium transition"
          >
            {saving ? 'Saving...' : '💾 Update Article'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* Editor Form */}
        <div className="lg:col-span-3 space-y-8">
          {/* Title & Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-green-700 mb-2">Article Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-6 py-4 border border-green-200 rounded-2xl focus:outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-green-700 mb-2">Slug</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="w-full px-6 py-4 border border-green-200 rounded-2xl focus:outline-none focus:border-green-500 font-mono text-sm"
              />
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium text-green-700 mb-2">Excerpt</label>
            <textarea
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              rows={3}
              className="w-full px-6 py-4 border border-green-200 rounded-2xl focus:outline-none focus:border-green-500"
            />
          </div>

          {/* Cover Image Uploader */}
          <div>
            <label className="block text-sm font-medium text-green-700 mb-3">Cover Image</label>
            <ImageUploader
              images={coverImages}
              onChange={setCoverImages}
              emoji="🌾"
            />
          </div>

          {/* Tags, Status, Markdown Editor... (same as before) */}
          {/* ... [Rest of the form remains identical to previous version] ... */}

          {/* (For brevity, the rest of the form is the same as the previous edit page I gave you) */}
        </div>

        {/* Live Preview - Same as before */}
        {preview && (
          <div className="lg:col-span-2 border border-green-100 rounded-3xl p-8 bg-white sticky top-8 self-start max-h-[calc(100vh-6rem)] overflow-auto">
            {/* Same preview content as previous version */}
            {form.coverImage && (
              <img src={form.coverImage} alt="Cover" className="w-full h-64 object-cover rounded-2xl mb-8 shadow-md" />
            )}
            <h1 className="font-playfair text-4xl text-green-900 mb-6">{form.title}</h1>
            <MarkdownRenderer content={form.content} />
          </div>
        )}
      </div>
    </div>
  );
}