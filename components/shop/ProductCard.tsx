'use client'
import { useCart } from '@/store/cart'
import { ShoppingCart, Plus } from 'lucide-react'
import { useState } from 'react'
import type { Product } from '@/types'
import { formatKES } from '@/lib/utils'

const BADGE_STYLES: Record<string, string> = {
  hot:  'bg-orange-500 text-white',
  new:  'bg-green-500 text-white',
  sale: 'bg-red-500 text-white',
}

export function ProductCard({ product }: { product: Product }) {
  const { addItem, openCart } = useCart()
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col group">
      {/* Image area */}
      <div className="relative h-44 bg-gradient-to-br from-green-50 to-amber-50 flex items-center justify-center text-6xl">
        {product.emoji}
        {product.badge && (
          <span className={`absolute top-2.5 left-2.5 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-md ${BADGE_STYLES[product.badge] || 'bg-gray-500 text-white'}`}>
            {product.badge}
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute inset-0 bg-white/70 flex items-center justify-center text-sm font-semibold text-gray-500 rounded-2xl">
            Out of stock
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-[11px] font-semibold text-green-700 uppercase tracking-wider mb-1">
          {product.category.name}
        </p>
        <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-1.5 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-xs text-gray-500 leading-relaxed mb-4 flex-1 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between mt-auto">
          <div>
            <span className="text-lg font-bold text-[#1f5e1f]">{formatKES(product.price)}</span>
            <span className="text-xs text-gray-400 ml-1">/unit</span>
          </div>
          <button
            onClick={handleAdd}
            disabled={product.stock === 0}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
              added
                ? 'bg-green-100 text-green-700'
                : 'bg-[#2a7a2a] hover:bg-[#163e16] text-white'
            } disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            {added ? '✓ Added' : <><Plus size={14} /> Add</>}
          </button>
        </div>
      </div>
    </div>
  )
}
