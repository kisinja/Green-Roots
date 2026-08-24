// components/blog/BlogGrid.tsx
"use client";

import { useState, useEffect } from "react";
import BlogCard from "./BlogCard";
import { Search, Filter, Sprout } from "lucide-react";

interface BlogGridProps {
  initialPosts: any[];
  totalPages: number;
}

export default function BlogGrid({ initialPosts, totalPages }: BlogGridProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Fetch filtered posts
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (selectedTag) params.set("tag", selectedTag);
      params.set("page", page.toString());

      const res = await fetch(`/api/blog?${params}`);
      const data = await res.json();
      setPosts(data.posts);
      setLoading(false);
    };

    fetchPosts();
  }, [search, selectedTag, page]);

  const allTags = Array.from(
    new Set(initialPosts.flatMap((p) => p.tags)),
  ).sort();

  return (
    <div className="max-w-7xl mx-auto px-6 pb-20">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-x-6 mb-12 gap-y-3 pt-10">
        <div className="flex-1 relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--green-600)] w-4 h-4" />
          <input
            type="text"
            placeholder="Search farming tips, crops, soil health..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-6 py-3.5 bg-white border border-[var(--earth-300)]/50 rounded-lg focus:outline-none focus:border-[var(--green-400)] text-[var(--green-900)] placeholder:text-[var(--green-800)]/40"
          />
        </div>

        <div className="flex items-center gap-3">
          <Filter className="text-[var(--green-600)] w-4 h-4 shrink-0" />
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="bg-white border border-[var(--earth-300)]/50 rounded-lg px-5 py-3.5 focus:outline-none focus:border-[var(--green-400)] text-[var(--green-800)]"
          >
            <option value="">All Topics</option>
            {allTags.map((tag) => (
              <option key={tag} value={tag} className="capitalize">
                {tag}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Posts Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-96 bg-[var(--green-50)] rounded-lg animate-pulse"
            />
          ))}
        </div>
      ) : posts.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post: any) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <Sprout className="mx-auto h-10 w-10 text-[var(--earth-500)]" />
          <h3 className="mt-5 font-display text-2xl text-[var(--green-900)]">
            No articles found
          </h3>
          <p className="mt-2 text-[var(--green-800)]/70">
            Try adjusting your search or filters
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2.5 mt-16">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-11 h-11 rounded-lg font-medium text-sm transition-colors ${
                page === p
                  ? "bg-[var(--green-900)] text-[var(--cream)]"
                  : "bg-white border border-[var(--earth-300)]/50 hover:border-[var(--green-400)] text-[var(--green-800)]"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
