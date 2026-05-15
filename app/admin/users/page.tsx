'use client'

import { useEffect, useState } from 'react'
import { Loader2, User } from 'lucide-react'

type UserType = {
  id: string
  name: string
  email: string
  phone?: string
  role: string
  createdAt: string
  _count: {
    orders: number
  }
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data)
        setLoading(false)
      })
  }, [])

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
        Users
      </h1>

      <div className="grid gap-4">
        {users.map(user => (
          <div
            key={user.id}
            className="bg-white border rounded-2xl p-5 flex justify-between items-center"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <User className="h-5 w-5 text-green-700" />
              </div>

              <div>
                <p className="font-semibold text-[#163e16]">
                  {user.name}
                </p>
                <p className="text-sm text-gray-500">
                  {user.email}
                </p>
                <p className="text-xs text-gray-400">
                  {user.phone || 'No phone'}
                </p>
              </div>
            </div>

            <div className="text-right">
              <span
                className={`text-xs px-3 py-1 rounded-full ${
                  user.role === 'ADMIN'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {user.role}
              </span>

              <p className="text-xs text-gray-400 mt-2">
                Orders: {user._count.orders}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}