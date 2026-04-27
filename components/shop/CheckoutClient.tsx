'use client'
import { useState } from 'react'
import { useCart } from '@/store/cart'
import { formatKES } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { Loader2, CheckCircle } from 'lucide-react'

type Step = 'details' | 'paying' | 'done'

export function CheckoutClient() {
  const { items, total, clearCart } = useCart()
  const router = useRouter()
  const [step, setStep] = useState<Step>('details')
  const [form, setForm] = useState({ name: '', phone: '', address: '' })
  const [error, setError] = useState('')
  const totalAmount = total()

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  if (items.length === 0 && step === 'details') {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-4xl mb-3">🛒</p>
        <p className="mb-4">Your cart is empty.</p>
        <a href="/shop" className="text-green-700 font-semibold hover:underline">Browse products →</a>
      </div>
    )
  }

  const handleCheckout = async () => {
    if (!form.name || !form.phone || !form.address) {
      setError('Please fill in all fields.')
      return
    }
    setError('')
    setStep('paying')

    try {
      // 1. Create order
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(i => ({ productId: i.product.id, quantity: i.quantity, price: i.product.price })),
          phone: form.phone,
          address: form.address,
          totalAmount,
        }),
      })

      if (!orderRes.ok) {
        const d = await orderRes.json()
        if (orderRes.status === 401) { router.push('/login?redirect=/checkout'); return }
        throw new Error(d.error || 'Failed to create order')
      }

      const { order } = await orderRes.json()

      // 2. Trigger STK push
      const stkRes = await fetch('/api/mpesa/stk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order.id, phone: form.phone, amount: totalAmount }),
      })

      if (!stkRes.ok) throw new Error('M-Pesa push failed. Try WhatsApp order.')

      clearCart()
      setStep('done')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setStep('details')
    }
  }

  if (step === 'done') {
    return (
      <div className="text-center py-16">
        <CheckCircle size={56} className="text-green-500 mx-auto mb-4" />
        <h2 className="font-semibold text-xl text-gray-800 mb-2">Order placed!</h2>
        <p className="text-gray-500 mb-6">Check your phone for the M-Pesa STK push and enter your PIN to confirm payment.</p>
        <a href="/orders" className="bg-[#2a7a2a] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#163e16] transition-all">
          View My Orders →
        </a>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Order summary */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5">
        <h3 className="font-semibold text-gray-800 mb-4">Order Summary</h3>
        <div className="space-y-3 mb-4">
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="flex items-center gap-3 text-sm">
              <span className="text-xl">{product.emoji}</span>
              <span className="flex-1 text-gray-700">{product.name} <span className="text-gray-400">×{quantity}</span></span>
              <span className="font-semibold">{formatKES(product.price * quantity)}</span>
            </div>
          ))}
        </div>
        <div className="border-t pt-3 flex justify-between">
          <span className="font-semibold text-gray-600">Total</span>
          <span className="text-xl font-bold text-green-700">{formatKES(totalAmount)}</span>
        </div>
      </div>

      {/* Details form */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4">
        <h3 className="font-semibold text-gray-800">Delivery Details</h3>
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Full Name</label>
          <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="John Kamau" className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green-400 transition-all" />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">M-Pesa Number</label>
          <input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="0712 345 678" type="tel" className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green-400 transition-all" />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Delivery Address</label>
          <input value={form.address} onChange={e => set('address', e.target.value)} placeholder="Rongai, Nairobi" className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green-400 transition-all" />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>

      {/* CTA */}
      <button
        onClick={handleCheckout}
        disabled={step === 'paying'}
        className="w-full bg-[#2a7a2a] hover:bg-[#163e16] disabled:opacity-60 text-white py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-3 transition-all"
      >
        {step === 'paying' ? (
          <><Loader2 size={20} className="animate-spin" /> Sending STK Push…</>
        ) : (
          <>Pay {formatKES(totalAmount)} via M-Pesa</>
        )}
      </button>

      <div className="relative flex items-center">
        <div className="flex-1 border-t border-gray-200" />
        <span className="mx-4 text-xs text-gray-400">or</span>
        <div className="flex-1 border-t border-gray-200" />
      </div>

      <a
        href={`https://wa.me/${process.env.NEXT_PUBLIC_WA_NUMBER || '254700000000'}?text=${encodeURIComponent(`Hello GreenRoots! 🌱\n\nI'd like to order:\n${items.map(i => `• ${i.product.name} ×${i.quantity} = ${formatKES(i.product.price * i.quantity)}`).join('\n')}\n\nTotal: ${formatKES(totalAmount)}\n\nDelivery: ${form.address || '—'}\nPhone: ${form.phone || '—'}`)}`}
        target="_blank" rel="noopener"
        className="w-full bg-[#25D366] hover:bg-[#1da851] text-white py-3.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all"
      >
        📱 Order via WhatsApp instead
      </a>
    </div>
  )
}
