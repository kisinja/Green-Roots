export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  stock: number
  emoji: string
  images?: string[]
  badge: string | null
  featured: boolean
  category: { id: string; name: string; slug: string; emoji: string }
  categoryId: string
  createdAt: Date | string

  longDescription?: string | null;
  features?: string[]
  specifications?: Record<string, string>

  averageRating?: number
  reviewCount?: number
}

export interface Category {
  id: string
  name: string
  slug: string
  emoji: string
  _count?: { products: number }
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Order {
  id: string
  status: string
  totalAmount: number
  phone: string
  address: string
  mpesaRef: string | null
  createdAt: string
  items: {
    id: string
    quantity: number
    price: number
    product: { name: string; emoji: string }
  }[]
  user?: { name: string; email: string; phone: string | null }
}

export interface User {
  id: string
  name: string
  email: string
  phone: string | null
  role: string
}

export type SlugParamsProps = Promise<{
  slug: string;
}>

export type IdParamsProps = Promise<{
  id: string;
}>