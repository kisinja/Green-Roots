// app/admin/blog/page.tsx
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-playfair text-green-900">Blog Management</h1>
        <Link
          href="/admin/blog/new"
          className="bg-green-700 hover:bg-green-800 text-white px-8 py-3.5 rounded-2xl font-medium transition"
        >
          + New Article
        </Link>
      </div>

      <div className="grid gap-6">
        {posts.map((post) => (
          <div key={post.id} className="flex items-center justify-between bg-white p-6 rounded-3xl border border-green-100">
            <div>
              <div className="font-medium text-lg">{post.title}</div>
              <div className="text-sm text-green-600">/{post.slug}</div>
            </div>
            <div className="flex items-center gap-4">
              <span className={`px-4 py-1 rounded-full text-xs ${post.published ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                {post.published ? 'Published' : 'Draft'}
              </span>
              <Link href={`/admin/blog/${post.id}/edit`} className="text-green-600 hover:text-green-700">Edit</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}