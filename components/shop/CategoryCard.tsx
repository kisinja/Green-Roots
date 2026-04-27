import Link from 'next/link'
import type { Category } from '@/types'

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/shop?category=${category.slug}`}
      className="bg-white border border-gray-200 rounded-2xl p-3 text-center hover:border-green-400 hover:bg-green-50 hover:-translate-y-1 transition-all duration-200 group"
    >
      <span className="text-3xl block mb-2">{category.emoji}</span>
      <p className="text-xs font-semibold text-gray-800 leading-tight">{category.name}</p>
      {category._count && (
        <p className="text-[10px] text-gray-400 mt-0.5">{category._count.products} items</p>
      )}
    </Link>
  )
}
