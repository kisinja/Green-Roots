// app/blog/page.tsx
import type { Metadata } from 'next';
import { getPublishedPosts, getFeaturedPosts } from '@/lib/blog';
import BlogHero from '@/components/blog/BlogHero';
import BlogGrid from '@/components/blog/BlogGrid';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://mkulimasupply.store'

export const metadata: Metadata = {
  title: 'Farming Tips & Agricultural Guides | Mkulima Supply Store Blog',
  description:
    'Expert articles on crop management, soil health, pest control, seed selection, and modern farming techniques in Kenya. Practical advice from certified agronomists.',
  keywords: [
    'farming tips Kenya',
    'crop management Kenya',
    'soil health guide',
    'pest control crops Kenya',
    'seed selection guide',
    'fertiliser application Kenya',
    'agricultural blog Kenya',
    'farming guide Nairobi',
  ].join(', '),
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    title: 'Farming Tips & Agricultural Guides | Mkulima Supply Store Blog',
    description:
      'Expert crop management, soil health, pest control, and farming guides for Kenyan farmers.',
    url: `${SITE_URL}/blog`,
    type: 'website',
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
