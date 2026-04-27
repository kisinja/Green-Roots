'use client'
import { useState, useMemo } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Search } from 'lucide-react'
import { ProductCard } from './ProductCard'
import type { Product, Category } from '@/types'

interface Props {
  products: Product[]
  categories: Category[]
  activeCategory?: string
  searchQuery?: string
}

export function ShopClient({ products, categories, activeCategory, searchQuery }: Props) {
  const [search, setSearch] = useState(searchQuery || '')
  const router = useRouter()
  const pathname = usePathname()

  const filtered = useMemo(() => {
    if (!search) return products
    return products.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.category.name.toLowerCase().includes(search.toLowerCase())
    )
  }, [products, search])

  const setCategory = (slug?: string) => {
    const params = new URLSearchParams()
    if (slug) params.set('category', slug)
    if (search) params.set('search', search)
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div>
      {/* Filters row */}
      <div className="flex flex-wrap gap-2 mb-6 items-center">
        <button
          onClick={() => setCategory()}
          className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${!activeCategory ? 'bg-[#2a7a2a] text-white border-[#2a7a2a]' : 'bg-white text-gray-600 border-gray-200 hover:border-green-400'}`}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.slug)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${activeCategory === cat.slug ? 'bg-[#2a7a2a] text-white border-[#2a7a2a]' : 'bg-white text-gray-600 border-gray-200 hover:border-green-400'}`}
          >
            {cat.emoji} {cat.name}
          </button>
        ))}

        {/* Search */}
        <div className="ml-auto flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 w-52">
          <Search size={14} className="text-gray-400 shrink-0" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products…"
            className="text-sm outline-none bg-transparent w-full text-gray-800 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Count */}
      <p className="text-sm text-gray-400 mb-4">{filtered.length} product{filtered.length !== 1 ? 's' : ''} found</p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">🔍</p>
          <p>No products found. Try a different search or category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  )
}
