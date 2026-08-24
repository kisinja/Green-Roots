// components/blog/BlogCard.tsx
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, Sprout, ArrowUpRight } from "lucide-react";

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
  const formattedDate = new Intl.DateTimeFormat("en-KE", {
    year: "numeric",
    month: "short",
  }).format(new Date(post.createdAt));

  return (
    <Link href={`/blog/${post.slug}`} className="group block h-full">
      <div className="bg-white rounded-lg overflow-hidden border border-[var(--earth-300)]/50 hover:border-[var(--green-400)] transition-colors duration-300 h-full flex flex-col">
        {/* Image */}
        <div className="relative h-56 overflow-hidden">
          {post.coverImage ? (
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full bg-[var(--green-50)] flex items-center justify-center">
              <Sprout className="h-10 w-10 text-[var(--earth-500)]" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex gap-2 mb-4 flex-wrap">
            {post.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2.5 py-1 border border-[var(--earth-300)]/60 text-[var(--earth-500)] rounded-full font-medium"
              >
                {tag}
              </span>
            ))}
          </div>

          <h3 className="font-display text-xl leading-tight text-[var(--green-900)] mb-3 line-clamp-3 group-hover:text-[var(--green-700)] transition-colors">
            {post.title}
          </h3>

          <p className="text-sm text-[var(--green-800)]/70 leading-6 line-clamp-3 mb-6 flex-1">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between text-xs text-[var(--green-800)]/60 pt-5 border-t border-[var(--earth-300)]/30 mt-auto">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {formattedDate}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {post.readTime || 5} min
              </span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-[var(--earth-500)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}
