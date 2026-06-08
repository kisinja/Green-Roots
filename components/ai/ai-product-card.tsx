"use client";

import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    image?: string;
    stock: number;
    averageRating: number;
    reviewCount: number;
  };
}

export function AIProductCard({ product }: ProductCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-white">
      <div className="relative h-44 w-full">
        <Image
          fill
          alt={product.name}
          src={product.image ?? "/placeholder-product.jpg"}
          className="object-cover"
        />
      </div>

      <div className="space-y-2 p-4">
        <h3 className="font-medium">{product.name}</h3>

        <div className="text-green-700 font-bold">
          KSh {product.price.toLocaleString()}
        </div>

        <div className="text-sm text-muted-foreground">
          ⭐ {product.averageRating}
          {" · "}
          {product.reviewCount} reviews
        </div>

        <div
          className={`text-sm ${
            product.stock > 0 ? "text-green-600" : "text-red-500"
          }`}
        >
          {product.stock > 0 ? "In Stock" : "Out Of Stock"}
        </div>

        <div className="flex gap-2 pt-2">
          <Link
            href={`/products/${product.slug}`}
            className="flex-1 rounded-xl bg-green-700 px-4 py-2 text-center text-white"
          >
            View Product
          </Link>

          <button className="rounded-xl border px-4 py-2">Add To Cart</button>
        </div>
      </div>
    </div>
  );
}
