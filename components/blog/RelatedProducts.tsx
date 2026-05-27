// components/blog/RelatedProducts.tsx
import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "../shop/ProductCard";

interface RelatedProductsProps {
  tags?: string[]; // Will be used to match products later
}

export default async function RelatedProducts({
  tags = [],
}: RelatedProductsProps) {
  // Build dynamic query based on tags
  let products = [];

  try {
    const searchParams = new URLSearchParams();
    searchParams.set("limit", "4");

    // Add tag filters to the query for better matching
    if (tags.length > 0) {
      searchParams.set("tags", tags.join(","));
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/products?${searchParams}`,
      { next: { revalidate: 3600 } },
    );

    const data = await res.json();
    products = data.products || data || [];
  } catch (e) {
    console.error("Error fetching related products:", e);
  }

  if (!products?.length) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20">
      <h2 className="text-4xl font-playfair text-green-900 mb-3">
        Products Related to This Article
      </h2>
      <p className="text-green-600 mb-10 max-w-2xl">
        Shop items that complement the farming techniques and recommendations in
        this guide
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.slice(0, 4).map((product: any) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
