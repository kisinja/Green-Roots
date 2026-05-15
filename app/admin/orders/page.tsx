'use client'

import { useEffect, useState } from 'react'
import { formatKES } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

type Order = {
  id: string
  status: string
  totalAmount: number
  createdAt: string
  mpesaRef?: string
  user: {
    name: string
    email: string
    phone?: string
  }
  items: {
    quantity: number
    price: number
    product: {
      name: string
      emoji: string
    }
  }[]
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/orders')
      .then(res => res.json())
      .then(data => {
        setOrders(data.orders || [])
        setLoading(false)
      })
  }, [])

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id)

    await fetch(`/api/admin/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })

    setOrders(prev =>
      prev.map(o => (o.id === id ? { ...o, status } : o))
    )

    setUpdating(null)
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20 text-gray-500">
        <Loader2 className="animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-[#163e16] mb-6">
        Orders
      </h1>

      <div className="space-y-4">
        {orders.map(order => (
          <div
            key={order.id}
            className="bg-white border rounded-2xl p-5 shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-[#163e16]">
                  {order.user.name}
                </p>
                <p className="text-sm text-gray-500">
                  {order.user.email}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>

              <span className="text-sm px-3 py-1 rounded-full bg-green-100 text-green-700">
                {order.status}
              </span>
            </div>

            <div className="mt-3 space-y-1 text-sm text-gray-600">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between">
                  <span>
                    {item.product.emoji} {item.product.name} ×
                    {item.quantity}
                  </span>
                  <span>
                    {formatKES(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-between items-center border-t pt-3">
              <p className="font-bold text-[#2a7a2a]">
                Total: {formatKES(order.totalAmount)}
              </p>

              <div className="flex gap-2">
                <select
                  value={order.status}
                  onChange={e =>
                    updateStatus(order.id, e.target.value)
                  }
                  className="border rounded-lg px-2 py-1 text-sm"
                >
                  <option>PENDING</option>
                  <option>CONFIRMED</option>
                  <option>PROCESSING</option>
                  <option>DELIVERED</option>
                  <option>CANCELLED</option>
                </select>

                {updating === order.id && (
                  <Loader2 className="animate-spin h-4 w-4" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}