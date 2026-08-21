// app/api/admin/blog/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

function slugify(input: string) {
    return input
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
}

function estimateReadTime(html: string) {
    const text = html.replace(/<[^>]*>/g, " ").trim();
    const words = text.split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 200));
}

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

        if (!body.title?.trim() || !body.excerpt?.trim() || !body.content?.trim()) {
            return NextResponse.json(
                { error: "Title, excerpt, and content are required" },
                { status: 400 },
            );
        }

        const slug = body.slug?.trim() ? slugify(body.slug) : slugify(body.title);

        const post = await prisma.blogPost.create({
            data: {
                title: body.title.trim(),
                slug,
                excerpt: body.excerpt.trim(),
                content: body.content,
                coverImage: body.coverImage || null,
                published: body.published ?? false,
                featured: body.featured ?? false,
                tags: (body.tags || []).map((t: string) => t.trim()).filter(Boolean),
                seoTitle: body.seoTitle?.trim() || body.title.trim(),
                seoDescription: body.seoDescription?.trim() || body.excerpt.trim(),
                seoKeywords: (body.seoKeywords || [])
                    .map((k: string) => k.trim())
                    .filter(Boolean),
                readTime:
                    body.readTime && Number(body.readTime) > 0
                        ? Number(body.readTime)
                        : estimateReadTime(body.content),
            },
        });

        return NextResponse.json(post, { status: 201 });
    } catch (error: any) {
        if (error.code === "P2002" && error.meta?.target?.includes("slug")) {
            return NextResponse.json(
                { error: "A post with this slug already exists. Please choose a different slug." },
                { status: 409 },
            );
        }

        console.error("Blog creation error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to create blog post" },
            { status: 500 },
        );
    }
}