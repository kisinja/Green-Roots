// app/api/admin/blog/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';


export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const resolvedParams = await params;
  const post = await prisma.blogPost.findUnique({ where: { id: resolvedParams.id } });
  return NextResponse.json(post);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const body = await req.json();

  const post = await prisma.blogPost.update({
    where: { id: (await params).id },
    data: {
      ...body,
      slug: body.slug || body.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      updatedAt: new Date(),
    },
  });

  return NextResponse.json(post);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const resolvedParams = await params;
  await prisma.blogPost.delete({ where: { id: resolvedParams.id } });
  return NextResponse.json({ success: true });
}