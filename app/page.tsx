import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/shop/ProductCard";
import { CategoryCard } from "@/components/shop/CategoryCard";
import { generateLocalBusinessJsonLd } from "@/lib/seo";
import { getWeather } from "@/lib/weather";
import { getHeroByWeather } from "@/lib/hero-intelligence";
import HomeBlogSection from "@/components/blog/HomeBlogSection";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.mkulimasupply.store";

export const metadata: Metadata = {
  title: {
    absolute: "Mkulima Supply Store Agrovet | Buy Farm Inputs Online Kenya",
  },
  description:
    "Buy certified seeds, fertilisers, pesticides & vet supplies online in Kenya. KEPHIS approved. Countrywide delivery. Pay via M-Pesa.",
  alternates: { canonical: SITE_URL },
  openGraph: {
    url: SITE_URL,
    type: "website",
  },
};

async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: { featured: true },
    include: { category: true },
    take: 6,
    orderBy: { createdAt: "desc" },
  });
}

async function getCategories() {
  return prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });
}

export default async function HomePage() {
  const [featured, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ]);

  const localBusinessJsonLd = generateLocalBusinessJsonLd();

  const weather = await getWeather();
  const hero = getHeroByWeather(weather);

  return (
    <>
      {/* Local Business structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessJsonLd),
        }}
      />

      {/* Hero */}
      {(() => {
        const bg =
          hero.theme === "rain"
            ? "from-sky-950 via-blue-900 to-green-900"
            : hero.theme === "sun"
              ? "from-orange-900 via-amber-700 to-green-800"
              : "from-[#163e16] via-[#1f5e1f] to-[#2a5e2a]";

        return (
          <section
            className={`relative overflow-hidden bg-gradient-to-br ${bg} py-20 px-4 text-center transition-all duration-700`}
          >
            {/* Background Pattern */}
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-rule='evenodd'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/svg%3E\")",
              }}
            />

            {/* Decorative Blobs */}
            <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
            <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-green-300/10 blur-3xl" />

            <div className="relative mx-auto max-w-3xl">
              {/* Weather Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-xs font-semibold uppercase tracking-widest text-green-100 backdrop-blur">
                {hero.tag}
              </div>

              {/* Heading */}
              <h1 className="mt-6 font-display text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
                {hero.title}
              </h1>

              {/* Subtitle */}
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/80">
                {hero.subtitle}
              </p>

              {/* CTA Buttons */}
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <Link
                  href={hero.cta}
                  className="rounded-xl bg-green-500 px-8 py-3.5 font-semibold text-white shadow-xl transition-all hover:-translate-y-1 hover:bg-green-400"
                >
                  Explore Solutions →
                </Link>

                <a
                  href="https://wa.me/254746403931"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-white/30 px-8 py-3.5 font-semibold text-white transition-all hover:bg-white/10"
                >
                  Ask an Expert
                </a>
              </div>

              {/* Weather Info */}
              <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-white/70">
                <div>🌡️ {weather.current.temperature_2m}°C</div>

                <div>🌧️ {weather.current.precipitation} mm</div>

                <div>💨 {weather.current.wind_speed_10m} km/h</div>
              </div>
            </div>
          </section>
        );
      })()}

      {/* Trust strip */}
      <div className="bg-[#fdf8f0] border-y border-[#e8ddd0] py-3 px-4">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-6">
          {[
            { icon: "🚚", text: "Free delivery above KES 2,000" },
            { icon: "✅", text: "KEPHIS certified inputs" },
            { icon: "📱", text: "Pay via M-Pesa" },
            { icon: "💬", text: "WhatsApp support" },
          ].map(({ icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-2 text-sm text-gray-500 font-medium"
            >
              <span>{icon}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="font-display text-2xl text-[#163e16] mb-6">
          Shop by Category
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat as never} />
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="font-display text-2xl text-[#163e16]">
            Featured Products
          </h2>
          <Link
            href="/shop"
            className="text-sm text-green-700 hover:text-green-800 font-semibold"
          >
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p as never} />
          ))}
        </div>
      </section>
      <HomeBlogSection />
    </>
  );
}
