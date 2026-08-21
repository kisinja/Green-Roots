import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({
    adapter,
});

//import { prisma } from '@/lib/prisma';


export async function getPublishedPosts({
    page = 1,
    limit = 9,
    tag,
    search,
}: {
    page?: number;
    limit?: number;
    tag?: string;
    search?: string;
}) {
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

    return {
        posts,
        total,
        totalPages: Math.ceil(total / limit)
    };
}

export async function getFeaturedPosts() {
    return prisma.blogPost.findMany({
        where: { published: true, featured: true },
        orderBy: { createdAt: 'desc' },
        take: 3,
    });
}

export async function getPostBySlug(slug: string) {
    if (!slug) return null;
    return prisma.blogPost.findUnique({
        where: { slug: slug, published: true },
    });
}

export async function getAllPublishedSlugs() {
    return prisma.blogPost.findMany({
        where: { published: true },
        select: { slug: true },
    });
}

// lib/blog.ts (add this)
export async function getShareCounts(postId: string) {
    const counts = await prisma.shareEvent.groupBy({
        by: ["platform"],
        where: { postId },
        _count: { platform: true },
    });

    return counts.reduce(
        (acc, c) => ({ ...acc, [c.platform]: c._count.platform }),
        {} as Record<string, number>,
    );
}

// For an admin overview across all posts:
export async function getShareCountsByPost() {
    const counts = await prisma.shareEvent.groupBy({
        by: ["postId", "platform"],
        _count: { platform: true },
    });

    return counts; // shape: [{ postId, platform, _count: { platform: n } }, ...]
}