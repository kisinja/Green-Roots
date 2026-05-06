import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { AdminDashboard } from '@/components/admin/AdminDashboard'
import { formatKES } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  /* try {
    await requireAdmin()
  } catch {
    redirect('/login?redirect=/admin')
  } */

  const [products, orders, users] = await Promise.all([
    prisma.product.findMany({ include: { category: true }, orderBy: { createdAt: 'desc' } }),
    prisma.order.findMany({
      include: { user: { select: { name: true, email: true, phone: true } }, items: { include: { product: { select: { name: true, emoji: true } } } } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count(),
  ])

  const totalRevenue = orders
    .filter((o) => o.status === 'CONFIRMED' || o.status === 'DELIVERED')
    .reduce((sum, o) => sum + o.totalAmount, 0)

  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } })

  return (
    <AdminDashboard
      products={products as never}
      orders={orders as never}
      categories={categories}
      stats={{
        totalProducts: products.length,
        totalOrders: orders.length,
        totalRevenue: formatKES(totalRevenue),
        totalUsers: users,
        pendingOrders: orders.filter((o) => o.status === 'PENDING').length,
      }}
    />
  )
}
