// app/blog/[slug]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getPostBySlug, getShareCounts } from "@/lib/blog";
import { generateBlogMetadata, generateBlogJsonLd } from "@/lib/seo";
import MarkdownRenderer from "@/components/blog/MarkdownRenderer";
import ReadingProgress from "@/components/blog/ReadingProgress";
import TableOfContents from "@/components/blog/TableOfContents";
import RelatedProducts from "@/components/blog/RelatedProducts";
import ShareButtons from "@/components/blog/ShareButtons";
import { Share2 } from "lucide-react";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.mkulimasupply.store";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await getPostBySlug(resolvedParams.slug);
  if (!post) return {};

  return generateBlogMetadata(post);
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const post = await getPostBySlug(resolvedParams.slug);

  if (!post) return notFound();

  const jsonLd = generateBlogJsonLd(post);
  const postUrl = `${SITE_URL}/blog/${post.slug}`;
  const shareCounts = await getShareCounts(post.id);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ReadingProgress />

      <div className="bg-[#fefcf8] min-h-screen">
        {/* Hero Image */}
        {post.coverImage && (
          <div className="relative h-[65vh] w-full">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/70" />
          </div>
        )}

        <div className="max-w-6xl mx-auto px-6 -mt-20 relative z-10">
          <div className="bg-white rounded-3xl shadow-xl p-10 md:p-16">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-sm text-green-600 mb-8">
              <Link href="/blog" className="hover:text-green-700">
                Article
              </Link>
              <span>→</span>
              <span className="text-green-800">{post.title}</span>
            </nav>

            <h1 className="font-playfair text-5xl md:text-6xl leading-tight text-green-900 mb-8">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center justify-between gap-6 mb-12">
              <div className="flex items-center gap-6 text-sm text-green-600">
                <time dateTime={post.createdAt.toISOString()}>
                  {new Intl.DateTimeFormat("en-KE", {
                    dateStyle: "long",
                  }).format(new Date(post.createdAt))}
                </time>
                {post.readTime && <span>• {post.readTime} min read</span>}
              </div>

              {/* Share bar (desktop/inline) */}
              <div className="flex items-center gap-6">
                <span
                  className="text-xs font-semibold uppercase tracking-wide text-gray-600"
                  style={{
                    marginBottom: Object.values(shareCounts).some(
                      (count) => count > 0,
                    )
                      ? "18px"
                      : undefined,
                  }}
                >
                  <Share2 />
                </span>
                <ShareButtons
                  url={postUrl}
                  title={post.title}
                  postId={post.id}
                  initialCounts={shareCounts}
                  variant="inline"
                />
              </div>
            </div>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-12">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-1.5 bg-green-50 text-green-700 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex gap-12">
              {/* Main Content */}
              <div className="flex-1 prose prose-green max-w-none">
                <div
                  dangerouslySetInnerHTML={{ __html: post.content as string }}
                  className="prose-headings:scroll-mt-20"
                />
              </div>

              {/* Sidebar TOC */}
              <TableOfContents content={post.content} />
            </div>
          </div>
        </div>

        {/* Related Products */}
        <RelatedProducts tags={post.tags} />

        {/* Share Buttons - Sticky on mobile */}
        <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-40 lg:hidden">
          <ShareButtons
            url={postUrl}
            title={post.title}
            postId={post.id}
            initialCounts={shareCounts}
            variant="floating"
          />
        </div>
      </div>
    </>
  );
}
