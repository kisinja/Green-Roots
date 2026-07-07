// app/admin/blog/page.tsx
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { Eye, Edit3, Trash2, Star, Calendar } from "lucide-react";
import BlogPostCard from "@/components/admin/BlogPostCard"; // New client component

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      coverImage: true,
      published: true,
      featured: true,
      createdAt: true,
      readTime: true,
      tags: true,
    },
  });

  return (
    <div className="min-h-screen bg-[#fefcf8] p-6 lg:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-5xl font-playfair text-green-900">
              Blog Management
            </h1>
            <p className="text-green-600 mt-2 text-lg">
              Manage your agricultural knowledge base • {posts.length} articles
            </p>
          </div>

          <Link
            href="/admin/blog/new"
            className="inline-flex items-center gap-3 bg-green-700 hover:bg-green-800 text-white px-8 py-4 rounded-2xl font-medium transition-all active:scale-95 shadow-lg shadow-green-900/20"
          >
            <span className="text-xl">+</span>
            New Article
          </Link>
        </div>

        {posts.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {posts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-green-200">
      <div className="text-6xl mb-6">🌱</div>
      <h3 className="text-2xl font-playfair text-green-900 mb-3">
        No articles yet
      </h3>
      <p className="text-green-600 max-w-sm mx-auto mb-8">
        Start sharing your farming knowledge with the community.
      </p>
      <Link
        href="/admin/blog/new"
        className="inline-block bg-green-700 text-white px-10 py-4 rounded-2xl hover:bg-green-800 transition"
      >
        Write Your First Article
      </Link>
    </div>
  );
}
