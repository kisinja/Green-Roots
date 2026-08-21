// app/api/admin/blog/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

function generateSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function calculateReadTime(content: string): number {
  if (!content?.trim()) return 0;

  const cleanText = content
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/[#*_`~>\-[\]()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleanText) return 0;

  const wordCount = cleanText
    .split(' ')
    .filter(Boolean)
    .length;

  return Math.max(1, Math.ceil(wordCount / 200));
}

function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return [
    ...new Set(
      value
        .filter((item): item is string => typeof item === 'string')
        .map((item) => item.trim())
        .filter(Boolean)
    ),
  ];
}


export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const resolvedParams = await params;
  const post = await prisma.blogPost.findUnique({ where: { id: resolvedParams.id } });
  return NextResponse.json(post);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Make sure the current user is an admin
    await requireAdmin();

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Blog post ID is required' },
        { status: 400 }
      );
    }

    const body = await req.json();

    /*
     * ------------------------------------------------------------
     * Validate required fields
     * ------------------------------------------------------------
     */

    const title =
      typeof body.title === 'string'
        ? body.title.trim()
        : '';

    const excerpt =
      typeof body.excerpt === 'string'
        ? body.excerpt.trim()
        : '';

    const content =
      typeof body.content === 'string'
        ? body.content
        : '';

    if (!title) {
      return NextResponse.json(
        { error: 'Article title is required' },
        { status: 400 }
      );
    }

    if (!content.trim()) {
      return NextResponse.json(
        { error: 'Article content is required' },
        { status: 400 }
      );
    }

    /*
     * ------------------------------------------------------------
     * Generate / normalize slug
     * ------------------------------------------------------------
     */

    const requestedSlug =
      typeof body.slug === 'string'
        ? body.slug.trim()
        : '';

    const slug = generateSlug(
      requestedSlug || title
    );

    if (!slug) {
      return NextResponse.json(
        { error: 'A valid slug could not be generated' },
        { status: 400 }
      );
    }

    /*
     * ------------------------------------------------------------
     * Normalize optional fields
     * ------------------------------------------------------------
     */

    const coverImage =
      typeof body.coverImage === 'string' &&
        body.coverImage.trim()
        ? body.coverImage.trim()
        : null;

    const tags = normalizeStringArray(body.tags);

    const seoKeywords = normalizeStringArray(
      body.seoKeywords
    );

    const seoTitle =
      typeof body.seoTitle === 'string' &&
        body.seoTitle.trim()
        ? body.seoTitle.trim()
        : null;

    const seoDescription =
      typeof body.seoDescription === 'string' &&
        body.seoDescription.trim()
        ? body.seoDescription.trim()
        : null;

    const published =
      typeof body.published === 'boolean'
        ? body.published
        : false;

    const featured =
      typeof body.featured === 'boolean'
        ? body.featured
        : false;

    /*
     * Always calculate read time from the actual content.
     * This prevents stale values being stored in the database.
     */
    const readTime = calculateReadTime(content);

    /*
     * ------------------------------------------------------------
     * Check that the article exists
     * ------------------------------------------------------------
     */

    const existingPost = await prisma.blogPost.findUnique({
      where: { id },
      select: {
        id: true,
      },
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    /*
     * ------------------------------------------------------------
     * Check slug uniqueness
     *
     * Important because BlogPost.slug is @unique.
     * ------------------------------------------------------------
     */

    const existingSlug = await prisma.blogPost.findFirst({
      where: {
        slug,
        NOT: {
          id,
        },
      },
      select: {
        id: true,
      },
    });

    if (existingSlug) {
      return NextResponse.json(
        {
          error: `The slug "${slug}" is already being used by another article.`,
        },
        { status: 409 }
      );
    }

    /*
     * ------------------------------------------------------------
     * Update article
     *
     * Explicitly define fields instead of spreading body.
     * This prevents accidental updates to id, createdAt, etc.
     * ------------------------------------------------------------
     */

    const post = await prisma.blogPost.update({
      where: { id },

      data: {
        title,
        slug,
        excerpt,
        content,

        coverImage,

        published,
        featured,

        tags,

        seoTitle,
        seoDescription,
        seoKeywords,

        readTime,

        updatedAt: new Date(),
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error(
      'PUT /api/admin/blog/[id] error:',
      error
    );

    /*
     * Prisma unique constraint error
     */
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'P2002'
    ) {
      return NextResponse.json(
        {
          error:
            'An article with this slug already exists.',
        },
        { status: 409 }
      );
    }

    /*
     * Prisma record-not-found error
     */
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'P2025'
    ) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to update blog post',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const resolvedParams = await params;
  await prisma.blogPost.delete({ where: { id: resolvedParams.id } });
  return NextResponse.json({ success: true });
}