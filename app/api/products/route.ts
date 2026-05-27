import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const featured = searchParams.get('featured')
    const tagsParam = searchParams.get('tags')

    const where: Record<string, unknown> = {}
    if (category) where.category = { slug: category }
    if (search) where.name = { contains: search, mode: 'insensitive' }
    if (featured === 'true') where.featured = true
    if (tagsParam) {
      const tagList = tagsParam.split(',').map(tag => tag.trim().toLowerCase());
      where.OR = tagList.flatMap(tg => [
        { name: { contains: tg, mode: 'insensitive' } },
        { description: { contains: tg, mode: 'insensitive' } },
        { longDescription: { contains: tg, mode: 'insensitive' } },
      ]);
    }

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
