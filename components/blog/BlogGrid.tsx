// components/blog/BlogGrid.tsx
"use client";

import { useState, useEffect } from "react";
import BlogCard from "./BlogCard";
import { Search, Filter } from "lucide-react";

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
      <div className="flex flex-col md:flex-row gap-x-6 mb-12 gap-y-2">
        <div className="flex-1 relative my-10">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-green-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Search farming tips, crops, soil health..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-white border border-green-200 rounded-2xl focus:outline-none focus:border-green-500 placeholder:text-green-400"
          />
        </div>

        <div className="flex items-center gap-3">
          <Filter className="text-green-600" />
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="bg-white border border-green-200 rounded-2xl px-6 py-4 focus:outline-none focus:border-green-500 text-green-700"
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
              className="h-96 bg-green-50 rounded-3xl animate-pulse"
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
          <div className="text-6xl mb-6">🌾</div>
          <h3 className="text-2xl font-playfair text-green-800 mb-3">
            No articles found
          </h3>
          <p className="text-green-600">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-3 mt-16">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-12 h-12 rounded-2xl font-medium transition-all ${
                page === p
                  ? "bg-green-700 text-white"
                  : "bg-white border border-green-200 hover:border-green-400 text-green-700"
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
