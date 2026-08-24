// app/blog/page.tsx
import type { Metadata } from "next";
import { getPublishedPosts, getFeaturedPosts } from "@/lib/blog";
import BlogHero from "@/components/blog/BlogHero";
import BlogGrid from "@/components/blog/BlogGrid";
import Furrows from "@/components/layout/furrows";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.mkulimasupply.store";

export const metadata: Metadata = {
  title: {
    absolute: "Farming Tips & Agricultural Guides | Mkulima Supply Store Blog",
  },
  description:
    "Expert articles on crop management, soil health, pest control, and seed selection for Kenyan farmers. Practical advice from certified agronomists.",
  keywords: [
    "farming tips Kenya",
    "crop management Kenya",
    "soil health guide",
    "pest control crops Kenya",
    "seed selection guide",
    "fertiliser application Kenya",
    "agricultural blog Kenya",
    "farming guide Nairobi",
  ].join(", "),
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    title: "Farming Tips & Agricultural Guides | Mkulima Supply Store Blog",
    description:
      "Expert crop management, soil health, pest control, and farming guides for Kenyan farmers.",
    url: `${SITE_URL}/blog`,
    type: "website",
  },
};

export default async function BlogPage() {
  const [featuredPosts, { posts, totalPages }] = await Promise.all([
    getFeaturedPosts(),
    getPublishedPosts({ page: 1 }),
  ]);

  return (
    <div className="min-h-screen bg-cream">
      <BlogHero />

      {/* Featured Section */}
      {featuredPosts.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pt-16 pb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--earth-500)]">
            Start Here
          </p>
          <h2 className="mt-3 font-display text-3xl text-[var(--green-900)] sm:text-4xl">
            Featured Articles
          </h2>
          {/* Featured cards render here */}
        </section>
      )}

      <div className="mx-auto max-w-7xl px-6">
        <Furrows tone="light" />
      </div>

      <BlogGrid initialPosts={posts} totalPages={totalPages} />
    </div>
  );
}
