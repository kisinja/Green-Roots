'use client'
import { useCart } from '@/store/cart'
import { X, ShoppingCart, Minus, Plus, Trash2 } from 'lucide-react'
import { formatKES } from '@/lib/utils'
import Link from 'next/link'

export function CartDrawer() {
  const { items, isOpen, closeCart, updateQty, removeItem, total } = useCart()
  const totalAmount = total()

  const buildWAMessage = () => {
    const lines = items.map(i => `• ${i.product.name} x${i.quantity} = ${formatKES(i.product.price * i.quantity)}`).join('\n')
    return encodeURIComponent(`Hello GreenRoots! 🌱\n\nI'd like to order:\n${lines}\n\nTotal: ${formatKES(totalAmount)}\n\nPlease confirm & advise on delivery.`)
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" onClick={closeCart} />
      )}

      {/* Drawer */}
      <div className={`fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingCart size={18} className="text-green-700" />
            <h2 className="font-semibold text-gray-900">Your Cart</h2>
            {items.length > 0 && (
              <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">{items.length}</span>
            )}
          </div>
          <button onClick={closeCart} className="p-2 rounded-xl hover:bg-gray-100 transition-all text-gray-500">
            <X size={18} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3">
              <ShoppingCart size={48} className="opacity-20" />
              <p className="text-sm">Your cart is empty</p>
              <button onClick={closeCart} className="text-green-700 text-sm font-semibold hover:underline">
                Continue shopping →
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex gap-3 pb-4 border-b border-gray-100">
                  <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-2xl shrink-0">
                    {product.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 leading-snug line-clamp-1">{product.name}</p>
                    <p className="text-sm font-bold text-green-700 mt-0.5">{formatKES(product.price * quantity)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateQty(product.id, quantity - 1)} className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all">
                        <Minus size={12} />
                      </button>
                      <span className="text-sm font-semibold w-5 text-center">{quantity}</span>
                      <button onClick={() => updateQty(product.id, quantity + 1)} className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all">
                        <Plus size={12} />
                      </button>
                      <button onClick={() => removeItem(product.id)} className="ml-auto p-1.5 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-500 transition-all">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 px-5 py-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Total</span>
              <span className="text-xl font-bold text-[#163e16]">{formatKES(totalAmount)}</span>
            </div>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="w-full bg-[#2a7a2a] hover:bg-[#163e16] text-white py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all"
            >
              Checkout with M-Pesa →
            </Link>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WA_NUMBER || '254700000000'}?text=${buildWAMessage()}`}
              target="_blank"
              rel="noopener"
              onClick={closeCart}
              className="w-full bg-[#25D366] hover:bg-[#1da851] text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all"
            >
              <span>📱</span> Order via WhatsApp
            </a>
          </div>
        )}
      </div>
    </>
  )
}
