// app/blog/page.tsx
import { Metadata } from 'next';
import { getPublishedPosts, getFeaturedPosts } from '@/lib/blog';
import BlogHero from '@/components/blog/BlogHero';
import BlogGrid from '@/components/blog/BlogGrid';

export const metadata: Metadata = {
  title: "Blog | GreenRoots - Agricultural Insights & Farming Tips",
  description: "Expert articles on sustainable farming, crop management, organic practices, and more from Kenya's leading agro platform.",
  openGraph: {
    title: "GreenRoots Blog - Modern Farming Knowledge",
    description: "Learn from the best in agriculture.",
  },
};

export default async function BlogPage() {
  const [featuredPosts, { posts, totalPages }] = await Promise.all([
    getFeaturedPosts(),
    getPublishedPosts({ page: 1 }),
  ]);

  return (
    <div className="min-h-screen bg-[#fefcf8]">
      <BlogHero />
      
      {/* Featured Section */}
      {featuredPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-16">
          <h2 className="text-4xl font-playfair text-green-800 mb-10">Featured Articles</h2>
          {/* We'll create this component next */}
        </section>
      )}

      <BlogGrid initialPosts={posts} totalPages={totalPages} />
    </div>
  );
}