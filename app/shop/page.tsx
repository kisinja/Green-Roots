import { prisma } from '@/lib/prisma'
import { ShopClient } from '@/components/shop/ShopClient'

export const dynamic = 'force-dynamic'

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>
}) {
  const { category, search } = await searchParams

  const where: Record<string, unknown> = {}
  if (category) where.category = { slug: category }
  if (search) where.name = { contains: search, mode: 'insensitive' }

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: 'asc' },
    }),
  ])

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="font-display text-3xl text-[#163e16] mb-2">All Products</h1>
      <p className="text-gray-500 mb-8">Quality farm inputs, delivered to your door.</p>
      <ShopClient products={products as never} categories={categories as never} activeCategory={category} searchQuery={search} />
    </div>
  )
}
