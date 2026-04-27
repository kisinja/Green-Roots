import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const featured = searchParams.get('featured')

    const where: Record<string, unknown> = {}
    if (category) where.category = { slug: category }
    if (search) where.name = { contains: search, mode: 'insensitive' }
    if (featured === 'true') where.featured = true

    const products = await prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ products })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
