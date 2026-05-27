import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { ShopClient } from '@/components/shop/ShopClient'

export const dynamic = 'force-dynamic'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://mkulimasupply.store'

export const metadata: Metadata = {
  title: { absolute: 'Shop Farm Inputs Online | Seeds, Fertilisers & Pesticides Kenya' },
  description:
    'Browse and buy certified seeds, fertilisers, pesticides, herbicides and veterinary supplies online in Kenya. Genuine agrovet products. Pay via M-Pesa. Fast countrywide delivery.',
  keywords: [
    'buy farm inputs online Kenya',
    'seeds Kenya online',
    'fertiliser online Kenya',
    'pesticides online Kenya',
    'herbicides Kenya',
    'agrovet shop online',
    'KEPHIS certified seeds Kenya',
    'veterinary supplies Kenya',
  ].join(', '),
  alternates: { canonical: `${SITE_URL}/shop` },
  openGraph: {
    title: 'Shop Farm Inputs | Mkulima Supply Store Agrovet',
    description:
      'Certified seeds, fertilisers, pesticides & vet supplies. All KEPHIS approved. Pay via M-Pesa.',
    url: `${SITE_URL}/shop`,
    type: 'website',
  },
}

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
      <ShopClient
        products={products as never}
        categories={categories as never}
        activeCategory={category}
        searchQuery={search}
      />
    </div>
  )
}
