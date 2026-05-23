// app/api/blog/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';


export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '9');
  const tag = searchParams.get('tag');
  const search = searchParams.get('search');

  const skip = (page - 1) * limit;

  const where: any = { published: true };

  if (tag) where.tags = { has: tag };
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { excerpt: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.blogPost.count({ where }),
  ]);

  return NextResponse.json({ posts, total, totalPages: Math.ceil(total / limit) });
}

// Admin only
export async function POST(req: NextRequest) {
  //await requireAdmin();
  const body = await req.json();

  const post = await prisma.blogPost.create({
    data: {
      ...body,
      slug: body.slug || body.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      readTime: Math.ceil(body.content.split(' ').length / 200) || 5,
    },
  });

  return NextResponse.json(post);
}