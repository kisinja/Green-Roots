// app/api/admin/blog/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';


export async function GET(req: NextRequest) {
    await requireAdmin();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
        prisma.blogPost.findMany({
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
        }),
        prisma.blogPost.count(),
    ]);

    return NextResponse.json({
        posts,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
    });
}

export async function POST(req: NextRequest) {
    await requireAdmin();

    try {
        const body = await req.json();

        const post = await prisma.blogPost.create({
            data: {
                title: body.title,
                slug: body.slug || body.title
                    .toLowerCase()
                    .replace(/\s+/g, '-')
                    .replace(/[^a-z0-9-]/g, ''),
                excerpt: body.excerpt,
                content: body.content,
                coverImage: body.coverImage,
                published: body.published ?? false,
                featured: body.featured ?? false,
                tags: body.tags || [],
                seoTitle: body.seoTitle,
                seoDescription: body.seoDescription,
                seoKeywords: body.seoKeywords || [],
                readTime: body.readTime || Math.ceil((body.content?.split(' ').length || 0) / 200),
            },
        });

        return NextResponse.json(post, { status: 201 });
    } catch (error: any) {
        console.error('Blog creation error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create blog post' },
            { status: 500 }
        );
    }
}