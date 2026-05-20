"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ShoppingCart, Star } from "lucide-react";

import { useCart } from "@/store/cart";
import { formatKES } from "@/lib/utils";

import type { Product } from "@/types";

const BADGE_STYLES: Record<string, string> = {
  "Just In": "bg-green-600 text-white",
  hot: "bg-orange-500 text-white",
  new: "bg-green-500 text-white",
  sale: "bg-red-500 text-white",
};

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  const [added, setAdded] = useState(false);

  const images =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : [];

  const [currentImage, setCurrentImage] = useState(0);

  // Auto image carousel
  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  const handleAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    addItem(product);

    setAdded(true);

    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <Link href={`/product/${product.slug}`} className="block h-full">
      <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        {/* Image Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#f4f9f1] to-[#eef7ea]">
          <div className="relative aspect-[4/3] w-full">
            {images.length > 0 ? (
              <>
                {images.map((image: string, index: number) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-700 ${
                      index === currentImage
                        ? "opacity-100"
                        : "opacity-0"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={product.name}
                      fill
                      loading="eager"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 400px"
                    />
                  </div>
                ))}
              </>
            ) : (
              <div className="flex h-full w-full items-center justify-center text-7xl">
                {product.emoji || "📦"}
              </div>
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/10 to-transparent" />

            {/* Badge */}
            {product.badge && (
              <div
                className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide shadow-md backdrop-blur-sm ${
                  BADGE_STYLES[product.badge] ||
                  "bg-black/80 text-white"
                }`}
              >
                {product.badge}
              </div>
            )}

            {/* Out of stock */}
            {product.stock === 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/75 backdrop-blur-[2px]">
                <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm">
                  Out of stock
                </span>
              </div>
            )}

            {/* Carousel Dots */}
            {images.length > 1 && (
              <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/25 px-2 py-1 backdrop-blur-sm">
                {images.map((_: string, index: number) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setCurrentImage(index);
                    }}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === currentImage
                        ? "w-5 bg-white"
                        : "w-1.5 bg-white/60"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-5">
          {/* Category */}
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2f7d32]">
            {product.category.name}
          </p>

          {/* Product Name */}
          <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug text-gray-900 transition-colors duration-200 group-hover:text-[#2f7d32]">
            {product.name}
          </h3>

          {/* Description */}
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-500">
            {product.description}
          </p>

          {/* Rating */}
          <div className="mt-4 flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1">
              <Star
                size={13}
                className="fill-amber-400 text-amber-400"
              />

              <span className="text-xs font-semibold text-amber-700">
                {product.averageRating?.toFixed(1) || "0.0"}
              </span>
            </div>

            <span className="text-xs text-gray-400">
              ({product.reviewCount || 0} reviews)
            </span>
          </div>

          {/* Footer */}
          <div className="mt-5 flex items-end justify-between gap-3 border-t border-gray-100 pt-4">
            {/* Price */}
            <div>
              <p className="text-[11px] uppercase tracking-wide text-gray-400">
                Price
              </p>

              <div className="flex items-end gap-1">
                <span className="text-2xl font-bold tracking-tight text-[#1f5e1f]">
                  {formatKES(product.price)}
                </span>

                <span className="pb-1 text-xs text-gray-400">
                  /unit
                </span>
              </div>
            </div>

            {/* Add Button */}
            <button
              onClick={handleAdd}
              disabled={product.stock === 0}
              className={`flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold shadow-sm transition-all duration-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 ${
                added
                  ? "bg-green-100 text-green-700"
                  : "bg-[#2f7d32] text-white hover:bg-[#1f5e1f] hover:shadow-md"
              }`}
            >
              {added ? (
                <>
                  <span>✓</span>
                  Added
                </>
              ) : (
                <>
                  <ShoppingCart size={16} />
                  Add
                </>
              )}
            </button>
          </div>
        </div>
      </article>
    </Link>
  );
}