// app/admin/blog/BlogPostCard.tsx
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Eye, Edit3, Trash2, Star, Calendar } from 'lucide-react';
import { showToast } from '@/components/ui/Toaster';
import { format } from 'date-fns';

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  published: boolean;
  featured: boolean;
  createdAt: Date;
  readTime: number | null;
  tags: string[];
}

interface BlogPostCardProps {
  post: Post;
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${post.title}"?`)) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/blog/${post.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        showToast("Article deleted successfully", "success");
        router.refresh(); // Refresh server component data
      } else {
        const error = await res.json();
        showToast(error.error || "Failed to delete article", "error");
      }
    } catch (err) {
      showToast("Something went wrong", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-green-100 hover:border-green-200 transition-all hover:shadow-xl flex flex-col">
      {/* Cover Image */}
      <div className="relative h-56 bg-green-50">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-green-300 text-6xl">
            🌾
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          {post.featured && (
            <div className="bg-yellow-400 text-yellow-900 text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1 shadow">
              <Star className="w-3.5 h-3.5" fill="currentColor" />
              Featured
            </div>
          )}
          <div
            className={`text-xs font-medium px-3 py-1 rounded-full shadow ${
              post.published ? 'bg-green-600 text-white' : 'bg-amber-500 text-white'
            }`}
          >
            {post.published ? 'Published' : 'Draft'}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="font-medium text-xl line-clamp-2 text-green-900 mb-3 group-hover:text-green-700 transition-colors">
          {post.title}
        </h3>

        <p className="text-green-600 text-sm line-clamp-2 mb-4 flex-1">
          {post.excerpt || "No excerpt available..."}
        </p>

        <div className="flex items-center justify-between text-xs text-green-500 mb-6">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            {format(new Date(post.createdAt),"dd MMM")}
          </div>
          {post.readTime && <span>{post.readTime} min read</span>}
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-6">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] bg-green-50 text-green-700 px-2.5 py-0.5 rounded-full"
              >
                #{tag}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="text-[10px] text-green-500">+{post.tags.length - 3}</span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 pt-4 border-t border-green-100 mt-auto">
          <Link
            href={`/blog/${post.slug}`}
            target="_blank"
            className="flex-1 flex items-center justify-center gap-2 py-3 text-green-700 hover:bg-green-50 rounded-2xl transition border border-green-100"
          >
            <Eye className="w-4 h-4" />
            View
          </Link>

          <Link
            href={`/admin/blog/${post.id}/edit`}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-700 text-white hover:bg-green-800 rounded-2xl transition"
          >
            <Edit3 className="w-4 h-4" />
            Edit
          </Link>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-3 text-red-500 hover:bg-red-50 rounded-2xl transition disabled:opacity-50"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}