// components/blog/HomeBlogSection.tsx
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

async function getRecentPosts() {
  return prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: 3,
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      coverImage: true,
      readTime: true,
      createdAt: true,
      tags: true,
    },
  });
}

export default async function HomeBlogSection() {
  const posts = await getRecentPosts();

  if (posts.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0c260c] via-[#163e16] to-[#1f5e1f] py-16 px-4">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-rule='evenodd'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />

      {/* Decorative Blobs */}
      <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[var(--earth-300)]/10 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-green-300/10 blur-3xl" />

      <div className="relative max-w-6xl mx-auto">
        <div className="flex items-baseline justify-between mb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--earth-300)]">
              Farm Journal
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold text-white">
              From the Farm Journal
            </h2>
            <p className="mt-1 text-sm text-white/60">
              Guides, tips, and insights for Kenyan farmers.
            </p>
          </div>
          <Link
            href="/blog"
            className="text-sm font-semibold text-white/80 hover:text-white whitespace-nowrap transition"
          >
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map((post) => (
            <article
              key={post.id}
              className="group flex flex-col overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl"
            >
              {/* Cover Image */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br from-[var(--green-100)] via-white to-[var(--green-50)]">
                {post.coverImage ? (
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-5xl">
                    🌾
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-6">
                {post.tags.length > 0 && (
                  <span className="mb-3 inline-block w-fit rounded-full bg-[var(--green-100)] px-3 py-1 text-xs font-medium text-[var(--green-700)]">
                    {post.tags[0]}
                  </span>
                )}

                <h3 className="font-display text-lg font-bold leading-snug text-[var(--green-900)] line-clamp-2">
                  {post.title}
                </h3>

                <p className="mt-2 flex-1 text-sm leading-relaxed text-black/60 line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="mt-4 flex items-center justify-between text-xs text-black/40">
                  <span>
                    {new Date(post.createdAt).toLocaleDateString("en-KE", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  {post.readTime && <span>{post.readTime} min read</span>}
                </div>

                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-5 inline-flex items-center justify-center rounded-2xl border border-[var(--green-600)] px-5 py-2.5 text-sm font-semibold text-[var(--green-700)] transition hover:bg-[var(--green-50)]"
                >
                  Read more
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
