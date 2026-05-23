// components/blog/RelatedProducts.tsx
import Image from 'next/image';
import Link from 'next/link';

interface RelatedProductsProps {
  tags?: string[]; // Will be used to match products later
}

export default async function RelatedProducts({ tags = [] }: RelatedProductsProps) {
  // Fetch products that match blog tags (simple version)
  // You can enhance this query later
  const products = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/products?limit=4`, {
    next: { revalidate: 3600 }
  }).then(res => res.json());

  if (!products?.length) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <h2 className="text-4xl font-playfair text-green-900 mb-4">Recommended for You</h2>
      <p className="text-green-600 mb-10">Products that complement this article</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.slice(0, 4).map((product: any) => (
          <Link
            key={product.id}
            href={`/products/${product.slug}`}
            className="group bg-white rounded-3xl overflow-hidden border border-green-100 hover:border-green-300 transition-all hover:shadow-xl"
          >
            <div className="relative h-52">
              <Image
                src={product.images[0] || '/placeholder-product.jpg'}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform"
              />
            </div>
            <div className="p-6">
              <div className="text-sm text-earth-500 mb-1">{product.category?.name}</div>
              <h4 className="font-medium text-green-900 line-clamp-2 mb-2">{product.name}</h4>
              <div className="text-green-700 font-semibold">KSh {product.price}</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}