import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { formatKES } from '@/lib/utils'

export const dynamic = 'force-dynamic'

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  PROCESSING: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
}

export default async function OrdersPage() {
  let session
  try {
    session = await requireAuth()
  } catch {
    redirect('/login?redirect=/orders')
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.userId },
    include: { items: { include: { product: { select: { name: true, emoji: true } } } } },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="font-display text-3xl text-[#163e16] mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">📦</p>
          <p className="text-lg">No orders yet.</p>
          <a href="/shop" className="mt-4 inline-block text-green-700 font-semibold hover:underline">Start shopping →</a>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="font-semibold text-sm text-gray-700">#{order.id.slice(-8).toUpperCase()}</span>
                  <span className="ml-3 text-xs text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
                  {order.status}
                </span>
              </div>
              <div className="space-y-1 mb-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-2 text-sm text-gray-600">
                    <span>{item.product.emoji}</span>
                    <span>{item.product.name}</span>
                    <span className="text-gray-400">×{item.quantity}</span>
                    <span className="ml-auto font-medium">{formatKES(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center border-t pt-3">
                <span className="text-sm text-gray-500">📍 {order.address}</span>
                <span className="font-bold text-green-700">{formatKES(order.totalAmount)}</span>
              </div>
              {order.mpesaRef && (
                <p className="text-xs text-gray-400 mt-2">M-Pesa Ref: {order.mpesaRef}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
