'use client'
import { useState } from 'react'
import { Package, ShoppingBag, Users, TrendingUp, AlertCircle, Plus, Trash2, Edit3, Check, X } from 'lucide-react'
import { formatKES } from '@/lib/utils'
import type { Product, Order, Category } from '@/types'

interface Stats { totalProducts: number; totalOrders: number; totalRevenue: string; totalUsers: number; pendingOrders: number }

interface Props { products: Product[]; orders: Order[]; categories: Category[]; stats: Stats }

const STATUS_OPTIONS = ['PENDING','CONFIRMED','PROCESSING','DELIVERED','CANCELLED']
const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  PROCESSING: 'bg-purple-100 text-purple-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
}

export function AdminDashboard({ products: initialProducts, orders: initialOrders, categories, stats }: Props) {
  const [tab, setTab] = useState<'overview'|'products'|'orders'>('overview')
  const [products, setProducts] = useState(initialProducts)
  const [orders, setOrders] = useState(initialOrders)
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', stock: '', emoji: '📦', badge: '', categoryId: '', featured: false })
  const [addError, setAddError] = useState('')
  const [adding, setAdding] = useState(false)

  const addProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.categoryId) { setAddError('Name, price and category are required'); return }
    setAdding(true); setAddError('')
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      })
      if (!res.ok) throw new Error((await res.json()).error)
      const { product } = await res.json()
      setProducts(prev => [product, ...prev])
      setNewProduct({ name: '', description: '', price: '', stock: '', emoji: '📦', badge: '', categoryId: '', featured: false })
    } catch (e) {
      setAddError(e instanceof Error ? e.message : 'Error')
    } finally { setAdding(false) }
  }

  const deleteProduct = async (id: string) => {
    if (!confirm('Delete this product?')) return
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  const updateOrderStatus = async (id: string, status: string) => {
    await fetch(`/api/admin/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
  }

  const inputClass = "border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-green-400 transition-all w-full"

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#163e16]" style={{fontFamily:'Playfair Display,serif'}}>Admin Panel</h1>
          <p className="text-gray-500 text-sm mt-1">GreenRoots Agrovet — Dashboard</p>
        </div>
        {stats.pendingOrders > 0 && (
          <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-2 rounded-xl text-sm font-medium">
            <AlertCircle size={15} /> {stats.pendingOrders} pending order{stats.pendingOrders > 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Package, label: 'Products', value: stats.totalProducts, color: 'bg-green-50 text-green-700' },
          { icon: ShoppingBag, label: 'Orders', value: stats.totalOrders, color: 'bg-blue-50 text-blue-700' },
          { icon: TrendingUp, label: 'Revenue', value: stats.totalRevenue, color: 'bg-amber-50 text-amber-700' },
          { icon: Users, label: 'Customers', value: stats.totalUsers, color: 'bg-purple-50 text-purple-700' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${color}`}>
              <Icon size={18} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500 mt-0.5 font-medium uppercase tracking-wide">{label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {(['overview','products','orders'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2.5 text-sm font-semibold capitalize transition-all border-b-2 -mb-px ${tab === t ? 'border-green-600 text-green-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Overview tab */}
      {tab === 'overview' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <h3 className="font-semibold text-gray-800 mb-4">Recent Orders</h3>
            <div className="space-y-3">
              {orders.slice(0, 5).map(o => (
                <div key={o.id} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium text-gray-800">#{o.id.slice(-6).toUpperCase()}</p>
                    <p className="text-xs text-gray-400">{o.user?.name} · {new Date(o.createdAt).toLocaleDateString('en-KE')}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-green-700">{formatKES(o.totalAmount)}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[o.status] || 'bg-gray-100 text-gray-500'}`}>{o.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <h3 className="font-semibold text-gray-800 mb-4">Stock Alerts</h3>
            <div className="space-y-3">
              {products.filter(p => p.stock < 20).slice(0, 6).map(p => (
                <div key={p.id} className="flex items-center justify-between text-sm">
                  <span>{p.emoji} {p.name}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${p.stock === 0 ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {p.stock === 0 ? 'Out of stock' : `${p.stock} left`}
                  </span>
                </div>
              ))}
              {products.filter(p => p.stock < 20).length === 0 && <p className="text-sm text-gray-400">All products well stocked ✓</p>}
            </div>
          </div>
        </div>
      )}

      {/* Products tab */}
      {tab === 'products' && (
        <div className="space-y-6">
          {/* Add product form */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><Plus size={16} /> Add New Product</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
              <input value={newProduct.name} onChange={e => setNewProduct(p => ({...p, name: e.target.value}))} placeholder="Product name *" className={inputClass} />
              <input value={newProduct.price} onChange={e => setNewProduct(p => ({...p, price: e.target.value}))} placeholder="Price (KES) *" type="number" className={inputClass} />
              <input value={newProduct.stock} onChange={e => setNewProduct(p => ({...p, stock: e.target.value}))} placeholder="Stock quantity" type="number" className={inputClass} />
              <select value={newProduct.categoryId} onChange={e => setNewProduct(p => ({...p, categoryId: e.target.value}))} className={inputClass}>
                <option value="">Select category *</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}
              </select>
              <input value={newProduct.emoji} onChange={e => setNewProduct(p => ({...p, emoji: e.target.value}))} placeholder="Emoji icon" className={inputClass} />
              <select value={newProduct.badge} onChange={e => setNewProduct(p => ({...p, badge: e.target.value}))} className={inputClass}>
                <option value="">No badge</option>
                <option value="new">New</option>
                <option value="hot">Hot</option>
                <option value="sale">Sale</option>
              </select>
            </div>
            <input value={newProduct.description} onChange={e => setNewProduct(p => ({...p, description: e.target.value}))} placeholder="Product description" className={`${inputClass} mb-3`} />
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input type="checkbox" checked={newProduct.featured} onChange={e => setNewProduct(p => ({...p, featured: e.target.checked}))} className="rounded" />
                Featured on homepage
              </label>
              {addError && <p className="text-red-500 text-sm">{addError}</p>}
              <button onClick={addProduct} disabled={adding} className="ml-auto bg-[#2a7a2a] hover:bg-[#163e16] text-white px-5 py-2 rounded-xl text-sm font-semibold disabled:opacity-60 transition-all">
                {adding ? 'Adding…' : '+ Add Product'}
              </button>
            </div>
          </div>

          {/* Products table */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-[1fr_100px_80px_70px_60px] gap-4 px-5 py-3 bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wide">
              <span>Product</span><span>Category</span><span>Price</span><span>Stock</span><span>Action</span>
            </div>
            {products.map(p => (
              <div key={p.id} className="grid grid-cols-[1fr_100px_80px_70px_60px] gap-4 px-5 py-3.5 border-b border-gray-50 hover:bg-gray-50 transition-all items-center text-sm">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xl shrink-0">{p.emoji}</span>
                  <span className="font-medium text-gray-800 truncate">{p.name}</span>
                  {p.badge && <span className="text-[10px] font-bold bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded shrink-0">{p.badge}</span>}
                </div>
                <span className="text-xs bg-green-50 text-green-700 font-semibold px-2 py-1 rounded-lg truncate">{p.category.name}</span>
                <span className="font-semibold text-gray-800">{formatKES(p.price)}</span>
                <span className={`font-semibold ${p.stock === 0 ? 'text-red-500' : p.stock < 20 ? 'text-yellow-600' : 'text-gray-700'}`}>{p.stock}</span>
                <button onClick={() => deleteProduct(p.id)} className="p-2 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-500 transition-all">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Orders tab */}
      {tab === 'orders' && (
        <div className="space-y-3">
          {orders.map(o => (
            <div key={o.id} className="bg-white border border-gray-200 rounded-2xl p-5">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div>
                  <span className="font-bold text-gray-800">#{o.id.slice(-8).toUpperCase()}</span>
                  <span className="ml-3 text-xs text-gray-400">{new Date(o.createdAt).toLocaleString('en-KE')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-green-700">{formatKES(o.totalAmount)}</span>
                  <select
                    value={o.status}
                    onChange={e => updateOrderStatus(o.id, e.target.value)}
                    className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:border-green-400"
                  >
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="text-xs text-gray-500 space-y-0.5 mb-3">
                {o.user && <p>👤 {o.user.name} · {o.user.email}</p>}
                <p>📍 {o.address} · 📞 {o.phone}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {o.items.map(item => (
                  <span key={item.id} className="bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-lg">
                    {item.product.emoji} {item.product.name} ×{item.quantity}
                  </span>
                ))}
              </div>
              {o.mpesaRef && <p className="text-xs text-gray-400 mt-2">M-Pesa: {o.mpesaRef}</p>}
            </div>
          ))}
          {orders.length === 0 && <p className="text-center text-gray-400 py-10">No orders yet.</p>}
        </div>
      )}
    </div>
  )
}
