// components/blog/BlogCard.tsx
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock } from 'lucide-react';

interface BlogCardProps {
  post: {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    coverImage?: string;
    createdAt: Date;
    readTime?: number;
    tags: string[];
  };
}

export default function BlogCard({ post }: BlogCardProps) {
  const formattedDate = new Intl.DateTimeFormat('en-KE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour:"numeric",
    minute:"2-digit",
    hour12:true
  }).format(new Date(post.createdAt));

  return (
    <Link href={`/blog/${post.slug}`} className="group block h-full">
      <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 h-full flex flex-col border border-green-100">
        {/* Image */}
        <div className="relative h-64 overflow-hidden">
          {post.coverImage ? (
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-green-100 to-earth-300 flex items-center justify-center">
              <span className="text-6xl">🌱</span>
            </div>
          )}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-green-800">
            {post.readTime || 5} min read
          </div>
        </div>

        {/* Content */}
        <div className="p-8 flex-1 flex flex-col">
          <div className="flex gap-2 mb-4 flex-wrap">
            {post.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-xs px-3 py-1 bg-green-50 text-green-700 rounded-full font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>

          <h3 className="font-playfair text-2xl leading-tight text-green-900 mb-4 line-clamp-3 group-hover:text-green-700 transition-colors">
            {post.title}
          </h3>

          <p className="text-green-600/90 line-clamp-3 mb-6 flex-1">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between text-sm text-green-600 pt-6 border-t border-green-100 mt-auto">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {formattedDate}
            </div>
            <div className="flex items-center gap-1 text-earth-500">
              <Clock className="w-4 h-4" />
              {post.readTime} min
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}