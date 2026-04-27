import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { ProductCard } from '@/components/shop/ProductCard'
import { CategoryCard } from '@/components/shop/CategoryCard'

async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: { featured: true },
    include: { category: true },
    take: 6,
  })
}

async function getCategories() {
  return prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: 'asc' },
  })
}

export default async function HomePage() {
  const [featured, categories] = await Promise.all([getFeaturedProducts(), getCategories()])

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#163e16] via-[#1f5e1f] to-[#2a5e2a] py-20 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-rule='evenodd'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/svg%3E\")" }}>
        </div>
        <div className="relative max-w-3xl mx-auto">
          <div className="inline-block bg-white/10 border border-white/20 text-green-200 text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full mb-6">
            🌱 Nairobi's Trusted Agrovet
          </div>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-5">
            Farm smarter.<br />
            <em className="text-green-200">Grow stronger.</em>
          </h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto mb-8 leading-relaxed">
            Certified seeds, fertilisers, pesticides & vet supplies. Delivered across Kenya. Pay via M-Pesa.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/shop"
              className="bg-green-500 hover:bg-green-400 text-white px-7 py-3.5 rounded-xl font-semibold transition-all hover:-translate-y-0.5 shadow-lg">
              Shop Now →
            </Link>
            <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WA_NUMBER || '254700000000'}`}
              target="_blank" rel="noopener"
              className="border border-white/30 hover:border-white text-white px-7 py-3.5 rounded-xl font-semibold transition-all hover:bg-white/10">
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <div className="bg-[#fdf8f0] border-y border-[#e8ddd0] py-3 px-4">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-6">
          {[
            { icon: '🚚', text: 'Free delivery above KES 2,000' },
            { icon: '✅', text: 'KEPHIS certified inputs' },
            { icon: '📱', text: 'Pay via M-Pesa' },
            { icon: '💬', text: 'WhatsApp support' },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-2 text-sm text-gray-500 font-medium">
              <span>{icon}</span><span>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="font-display text-2xl text-[#163e16] mb-6">Shop by Category</h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="font-display text-2xl text-[#163e16]">Featured Products</h2>
          <Link href="/shop" className="text-sm text-green-700 hover:text-green-800 font-semibold">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p as never} />
          ))}
        </div>
      </section>
    </>
  )
}
