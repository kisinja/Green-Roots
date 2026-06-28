import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { slugify } from '@/lib/utils'

export async function GET() {
  try {
    await requireAdmin()
    const products = await prisma.product.findMany({
      where: { isActive: true },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ products })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: msg }, { status: msg === 'Forbidden' ? 403 : 401 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin()
    const data = await req.json()
    const {
      name,
      description,
      longDescription,
      features,
      specifications,
      price,
      stock,
      emoji,
      badge,
      featured,
      categoryId,
      images,
    } = data;

    if (!name || !price || !categoryId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const parsedFeatures =
      Array.isArray(features)
        ? features
        : typeof features === "string"
          ? features
            .split("\n")
            .map((f: string) => f.trim())
            .filter(Boolean)
          : [];

    const parsedSpecifications =
      typeof specifications === "object"
        ? specifications
        : {};

    const product = await prisma.product.create({
      data: {
        name,
        slug:
          (slugify(name)
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')) + '-' + Date.now(),

        description: description || "",
        longDescription: longDescription || "",

        features: parsedFeatures,
        specifications: parsedSpecifications,

        price: Number(price),
        stock: Number(stock) || 0,

        emoji: emoji || "📦",

        badge: badge || null,

        featured: Boolean(featured),

        categoryId,
        images: images || [],
      },

      include: {
        category: true,
      },
    });

    return NextResponse.json({ product }, { status: 201 })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
