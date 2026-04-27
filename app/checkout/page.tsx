import { CheckoutClient } from '@/components/shop/CheckoutClient'

export default function CheckoutPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="font-display text-3xl text-[#163e16] mb-2">Checkout</h1>
      <p className="text-gray-500 mb-8">Complete your order. Pay via M-Pesa or place via WhatsApp.</p>
      <CheckoutClient />
    </div>
  )
}
