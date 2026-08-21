// components/product/ProductImageGallery.tsx
"use client";

import { useState } from "react";
import Image from "next/image";

const PLACEHOLDER_IMAGE = "/images/product-placeholder.jpg"; // put a real placeholder here

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
  badge?: string | null;
  emoji?: string | null;
}

export default function ProductImageGallery({
  images,
  productName,
  badge,
  emoji,
}: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [brokenImages, setBrokenImages] = useState<Set<number>>(new Set());

  const markBroken = (index: number) => {
    setBrokenImages((prev) => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  };

  const getSrc = (index: number) =>
    brokenImages.has(index) ? PLACEHOLDER_IMAGE : images[index];

  return (
    <div className="space-y-5">
      {/* Main Image */}
      <div className="group relative overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-xl">
        {badge && (
          <div className="absolute left-5 top-5 z-20 rounded-full bg-[var(--green-700)] px-4 py-2 text-sm font-semibold text-white shadow-lg">
            {badge}
          </div>
        )}

        {images.length > 0 ? (
          <div className="relative aspect-square w-full overflow-hidden">
            <Image
              src={getSrc(activeIndex)}
              alt={productName}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              loading="eager"
              onError={() => markBroken(activeIndex)}
            />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        ) : (
          <div className="flex aspect-square items-center justify-center bg-gradient-to-br from-[var(--green-100)] via-white to-[var(--green-50)]">
            <div className="flex h-64 w-64 items-center justify-center rounded-full bg-white text-[9rem] shadow-2xl">
              {emoji || "📦"}
            </div>
          </div>
        )}

        <div className="absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-[var(--green-200)] opacity-30 blur-3xl" />
        <div className="absolute -left-10 top-20 h-40 w-40 rounded-full bg-[var(--earth-300)] opacity-20 blur-3xl" />
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-4 sm:grid-cols-5">
          {images.map((image, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`View image ${index + 1} of ${productName}`}
              aria-current={index === activeIndex}
              className={`group relative overflow-hidden rounded-2xl border bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md ${
                index === activeIndex
                  ? "border-[var(--green-600)] ring-2 ring-[var(--green-100)]"
                  : "border-black/5"
              }`}
            >
              <div className="relative aspect-square w-full">
                <Image
                  src={getSrc(index)}
                  alt={`${productName} image ${index + 1}`}
                  fill
                  sizes="(max-width: 640px) 25vw, 20vw"
                  loading="eager"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={() => markBroken(index)}
                />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
