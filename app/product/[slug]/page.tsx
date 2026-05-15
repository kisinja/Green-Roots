// app/products/[slug]/page.tsx

import { ShieldCheck, Truck, Star } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Product } from "@/types";
import BackBtn from "@/components/ui/BackBtn";
import AddToCartBtn from "@/components/ui/AddToCartBtn";

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product: Product | null = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-cream">
        <h1 className="text-2xl font-bold text-[var(--green-900)]">
          Product not found
        </h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cream">
      {/* Breadcrumb */}
      <section className="border-b border-black/5 bg-white/70 backdrop-blur">
        <BackBtn />
      </section>

      {/* Product Section */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-16">
        {/* Product Image */}
        <div className="relative overflow-hidden rounded-3xl border border-black/5 bg-gradient-to-br from-[var(--green-100)] via-white to-[var(--green-50)] shadow-xl">
          {product.badge && (
            <div className="absolute left-6 top-6 z-10 rounded-full bg-[var(--green-700)] px-4 py-2 text-sm font-semibold text-white shadow-lg">
              {product.badge}
            </div>
          )}

          <div className="flex h-[500px] items-center justify-center">
            <div className="flex h-64 w-64 items-center justify-center rounded-full bg-white text-[9rem] shadow-2xl">
              {product.emoji}
            </div>
          </div>

          {/* Floating accents */}
          <div className="absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-[var(--green-200)] opacity-40 blur-3xl" />
          <div className="absolute -left-10 top-20 h-40 w-40 rounded-full bg-[var(--earth-300)] opacity-30 blur-3xl" />
        </div>

        {/* Product Content */}
        <div className="flex flex-col justify-center">
          <div className="mb-4 flex items-center gap-3">
            <span className="rounded-full bg-[var(--green-100)] px-3 py-1 text-sm font-medium text-[var(--green-700)]">
              {product.category.name}
            </span>

            {product.stock > 0 ? (
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
                In Stock
              </span>
            ) : (
              <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700">
                Out of Stock
              </span>
            )}
          </div>

          <h1 className="font-display text-4xl font-bold leading-tight text-[var(--green-900)] md:text-5xl">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="mt-5 flex items-center gap-2">
            <div className="flex items-center gap-1 text-yellow-500">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="h-5 w-5 fill-current" />
              ))}
            </div>

            <span className="text-sm text-black/50">
              4.9 (128 verified farmers)
            </span>
          </div>

          {/* Price */}
          <div className="mt-8 flex items-end gap-3">
            <h2 className="text-5xl font-bold text-[var(--green-700)]">
              KSh {product.price.toLocaleString()}
            </h2>

            <span className="mb-1 text-lg text-black/40 line-through">
              KSh 1,500
            </span>
          </div>

          {/* Description */}
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-black/70">
            {product.description}
          </p>

          {/* Quantity + CTA */}
          <AddToCartBtn product={product} quantity={1} />

          {/* Trust Indicators */}
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
              <Truck className="mb-3 h-6 w-6 text-[var(--green-700)]" />

              <h3 className="font-semibold text-[var(--green-900)]">
                Fast Delivery
              </h3>

              <p className="mt-1 text-sm text-black/60">
                Countrywide delivery in 24–72 hrs.
              </p>
            </div>

            <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
              <ShieldCheck className="mb-3 h-6 w-6 text-[var(--green-700)]" />

              <h3 className="font-semibold text-[var(--green-900)]">
                Verified Quality
              </h3>

              <p className="mt-1 text-sm text-black/60">
                Genuine agrovet-approved products.
              </p>
            </div>

            <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
              <span className="mb-3 block text-2xl">🌱</span>

              <h3 className="font-semibold text-[var(--green-900)]">
                Expert Support
              </h3>

              <p className="mt-1 text-sm text-black/60">
                Get farming guidance from professionals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Details Tabs */}
      <section className="border-t border-black/5 bg-white/70 py-16 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Left */}
            <div className="lg:col-span-2">
              <div className="rounded-3xl border border-black/5 bg-white p-8 shadow-sm">
                <h2 className="font-display text-3xl font-bold text-[var(--green-900)]">
                  Product Information
                </h2>

                <div className="mt-6 space-y-5 text-black/70">
                  <p>
                    These premium hybrid tomato seeds are specially selected to
                    produce high yields while maintaining excellent fruit
                    quality and resistance against common crop diseases.
                  </p>

                  <p>
                    Suitable for both greenhouse and open-field farming with
                    optimal germination rates and consistent growth performance.
                  </p>

                  <ul className="space-y-3">
                    <li>✅ High germination rate</li>
                    <li>✅ Disease resistant variety</li>
                    <li>✅ Suitable for all seasons</li>
                    <li>✅ Recommended by agricultural experts</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="space-y-6">
              <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-bold text-[var(--green-900)]">
                  Quick Details
                </h3>

                <div className="mt-5 space-y-4 text-sm">
                  <div className="flex justify-between border-b border-black/5 pb-3">
                    <span className="text-black/50">Category</span>
                    <span className="font-semibold">
                      {product.category.name}
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-black/5 pb-3">
                    <span className="text-black/50">Stock</span>
                    <span className="font-semibold">{product.stock} Units</span>
                  </div>

                  <div className="flex justify-between border-b border-black/5 pb-3">
                    <span className="text-black/50">SKU</span>
                    <span className="font-semibold">
                      AGR-{product.id.slice(0, 6).toUpperCase()}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-black/50">Featured</span>
                    <span className="font-semibold">
                      {product.featured ? "Yes" : "No"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl bg-[var(--green-700)] p-6 text-white shadow-xl">
                <h3 className="text-2xl font-bold">Need Help Choosing?</h3>

                <p className="mt-3 text-white/80">
                  Speak with our agricultural experts for personalized farming
                  advice.
                </p>

                <button className="mt-6 w-full rounded-2xl bg-white px-5 py-4 font-semibold text-[var(--green-700)] transition hover:bg-[var(--green-50)]">
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
