// app/product/[slug]/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import {
  ShieldCheck,
  Truck,
  Star,
  Leaf,
  Package,
  Sprout,
  CalendarDays,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import { Product } from "@/types";
import {
  generateProductMetadata,
  generateProductJsonLd,
  generateBreadcrumbJsonLd,
} from "@/lib/seo";

import BackBtn from "@/components/ui/BackBtn";
import AddToCartBtn from "@/components/ui/AddToCartBtn";
import ProductReviews from "@/components/reviews/product-reviews";
import ProductImageGallery from "@/components/product/ProductImageGallery";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://mkulimasupply.store";

export async function generateStaticParams() {
  try {
    const products = await prisma.product.findMany({ select: { slug: true } });
    return products.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });
  if (!product) return {};
  return generateProductMetadata(product);
}

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = (await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  })) as unknown as Product | null;

  if (!product) notFound();

  const specifications =
    (product.specifications as Record<string, string>) || {};

  const images =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : [];

  const productJsonLd = generateProductJsonLd(product);
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    { name: "Shop", url: `${SITE_URL}/shop` },
    {
      name: product.category.name,
      url: `${SITE_URL}/shop?category=${product.category.slug}`,
    },
    { name: product.name, url: `${SITE_URL}/product/${product.slug}` },
  ]);

  return (
    <main className="min-h-screen bg-[#fafcf8]">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Breadcrumb */}
      <section className="sticky top-0 z-30 border-b border-black/5 bg-white/80 backdrop-blur-xl">
        <BackBtn />
      </section>

      {/* Product Section */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 py-8 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-14">
        {/* LEFT - Product Images */}
        <ProductImageGallery
          images={images}
          productName={product.name}
          badge={product.badge}
          emoji={product.emoji}
        />

        {/* RIGHT - Product Content */}
        <div className="flex flex-col justify-center">
          {/* Meta */}
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-[var(--green-100)] px-4 py-1.5 text-sm font-medium text-[var(--green-700)]">
              {product.category.name}
            </span>

            {product.stock > 0 ? (
              <span className="rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-medium text-emerald-700">
                In Stock
              </span>
            ) : (
              <span className="rounded-full bg-red-100 px-4 py-1.5 text-sm font-medium text-red-700">
                Out of Stock
              </span>
            )}

            {product.featured && (
              <span className="rounded-full bg-yellow-100 px-4 py-1.5 text-sm font-medium text-yellow-700">
                ⭐ Featured
              </span>
            )}
          </div>

          {/* Product Name */}
          <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-[var(--green-900)] md:text-5xl">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="mt-5 flex items-center gap-3">
            <div className="flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1.5">
              <Star size={15} className="fill-amber-400 text-amber-400" />
              <span className="text-sm font-semibold text-amber-700">
                {product.averageRating?.toFixed(1) || "0.0"}
              </span>
            </div>
            <span className="text-sm text-black/50">
              ({product.reviewCount || 0} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="mt-8 flex items-end gap-4">
            <h2 className="text-5xl font-bold tracking-tight text-[var(--green-700)]">
              KSh {product.price.toLocaleString()}
            </h2>
            <span className="mb-1 text-lg text-black/30 line-through">
              KSh {(product.price * 1.2).toLocaleString()}
            </span>
          </div>

          {/* Description */}
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-black/65">
            {product.description}
          </p>

          {/* Highlight Cards */}
          <div className="mt-10 grid grid-cols-2 gap-4">
            {specifications.seedType && (
              <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                <Leaf className="mb-3 h-5 w-5 text-[var(--green-700)]" />
                <p className="text-xs uppercase tracking-wide text-black/40">
                  Seed Type
                </p>
                <p className="mt-1 font-semibold text-[var(--green-900)]">
                  {specifications.seedType}
                </p>
              </div>
            )}

            {specifications.plantingSeason && (
              <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                <CalendarDays className="mb-3 h-5 w-5 text-[var(--green-700)]" />
                <p className="text-xs uppercase tracking-wide text-black/40">
                  Planting Season
                </p>
                <p className="mt-1 font-semibold text-[var(--green-900)]">
                  {specifications.plantingSeason}
                </p>
              </div>
            )}

            {specifications.maturity && (
              <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                <Sprout className="mb-3 h-5 w-5 text-[var(--green-700)]" />
                <p className="text-xs uppercase tracking-wide text-black/40">
                  Maturity
                </p>
                <p className="mt-1 font-semibold text-[var(--green-900)]">
                  {specifications.maturity}
                </p>
              </div>
            )}

            {specifications.farmingMethod && (
              <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                <Package className="mb-3 h-5 w-5 text-[var(--green-700)]" />
                <p className="text-xs uppercase tracking-wide text-black/40">
                  Farming Method
                </p>
                <p className="mt-1 font-semibold text-[var(--green-900)]">
                  {specifications.farmingMethod}
                </p>
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="my-10">
            <AddToCartBtn product={product} quantity={1} />
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
              <Truck className="mb-3 h-6 w-6 text-[var(--green-700)]" />
              <h3 className="font-semibold text-[var(--green-900)]">
                Fast Delivery
              </h3>
              <p className="mt-1 text-sm text-black/60">
                Countrywide delivery in 24–72 hrs.
              </p>
            </div>

            <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
              <ShieldCheck className="mb-3 h-6 w-6 text-[var(--green-700)]" />
              <h3 className="font-semibold text-[var(--green-900)]">
                Verified Quality
              </h3>
              <p className="mt-1 text-sm text-black/60">
                Genuine agrovet-approved products.
              </p>
            </div>

            <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
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

      {/* Product Details */}
      <section className="border-t border-black/5 bg-white/60 py-16 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* LEFT */}
            <div className="space-y-8 lg:col-span-2">
              {/* Information */}
              <div className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-sm">
                <h2 className="font-display text-3xl font-bold text-[var(--green-900)]">
                  Product Information
                </h2>

                <div className="mt-6 space-y-6 text-black/70">
                  <p className="leading-relaxed">{product.description}</p>

                  {product.longDescription && (
                    <div className="rounded-3xl bg-[var(--green-50)] p-6">
                      <h3 className="mb-3 text-lg font-semibold text-[var(--green-900)]">
                        Detailed Overview
                      </h3>
                      <p className="leading-relaxed">
                        {product.longDescription}
                      </p>
                    </div>
                  )}

                  {product.features && product.features.length > 0 && (
                    <div>
                      <h3 className="mb-5 text-xl font-bold text-[var(--green-900)]">
                        Key Features
                      </h3>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {product.features.map(
                          (feature: string, index: number) => (
                            <div
                              key={index}
                              className="flex gap-3 rounded-2xl border border-[var(--green-100)] bg-[var(--green-50)] p-4"
                            >
                              <span className="text-lg text-[var(--green-700)]">
                                ✅
                              </span>
                              <span className="text-sm font-medium text-black/70">
                                {feature}
                              </span>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Reviews */}
              <ProductReviews productId={product.id} />
            </div>

            {/* RIGHT */}
            <div className="space-y-6">
              {/* Quick Details */}
              <div className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm">
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

                  <div className="flex justify-between border-b border-black/5 pb-3">
                    <span className="text-black/50">Featured</span>
                    <span className="font-semibold">
                      {product.featured ? "Yes" : "No"}
                    </span>
                  </div>

                  {/* Dynamic Specifications */}
                  {Object.entries(specifications).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between border-b border-black/5 pb-3"
                    >
                      <span className="capitalize text-black/50">
                        {key.replace(/([A-Z])/g, " $1")}
                      </span>
                      <span className="max-w-[140px] text-right font-semibold">
                        {String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Help Card */}
              <div className="rounded-[2rem] bg-[var(--green-700)] p-6 text-white shadow-xl">
                <h3 className="text-2xl font-bold">Need Help Choosing?</h3>
                <p className="mt-3 text-white/80">
                  Speak with our agricultural experts for personalized farming
                  advice.
                </p>
                <button className="mt-6 w-full rounded-2xl bg-white px-5 py-4 font-semibold text-[var(--green-700)] transition hover:bg-[var(--green-50)]">
                  Contact Support
                </button>
              </div>

              {/* Farming Tip */}
              <div className="rounded-[2rem] border border-black/5 bg-gradient-to-br from-[var(--green-50)] to-white p-6 shadow-sm">
                <h3 className="text-xl font-bold text-[var(--green-900)]">
                  🌿 Farming Tip
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-black/70">
                  For best results, store seeds in a cool dry place and follow
                  proper soil preparation before planting.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
