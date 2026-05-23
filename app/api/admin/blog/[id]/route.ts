// app/api/admin/blog/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';


export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await requireAdmin();
  const post = await prisma.blogPost.findUnique({ where: { id: params.id } });
  return NextResponse.json(post);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await requireAdmin();
  const body = await req.json();

  const post = await prisma.blogPost.update({
    where: { id: params.id },
    data: {
      ...body,
      slug: body.slug || body.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      updatedAt: new Date(),
    },
  });

  return NextResponse.json(post);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await requireAdmin();
  await prisma.blogPost.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}