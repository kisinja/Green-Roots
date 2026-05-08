import { NextRequest, NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import slugify from "slugify";

// ✅ GET ALL CATEGORIES
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    return NextResponse.json({categories});
  } catch (error) {
    console.error("GET CATEGORIES ERROR:", error);

    return NextResponse.json(
      { message: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// ✅ CREATE CATEGORY
export async function POST(req: NextRequest) {
  try {
    // 🔒 ADMIN ONLY
    await requireAdmin();

    const body = await req.json();

    const { name, emoji } = body;

    if (!name || !emoji) {
      return NextResponse.json(
        { message: "Name and emoji are required" },
        { status: 400 }
      );
    }

    const slug = slugify(name, {
      lower: true,
      strict: true,
      trim: true,
    });

    const existingCategory = await prisma.category.findFirst({
      where: {
        OR: [{ name }, { slug }],
      },
    });

    if (existingCategory) {
      return NextResponse.json(
        { message: "Category already exists" },
        { status: 409 }
      );
    }

    const category = await prisma.category.create({
      data: {
        name,
        emoji,
        slug,
      },
    });

    return NextResponse.json(category, {
      status: 201,
    });
  } catch (error) {
    console.error("CREATE CATEGORY ERROR:", error);

    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        return NextResponse.json(
          { message: "Unauthorized" },
          { status: 401 }
        );
      }

      if (error.message === "Forbidden") {
        return NextResponse.json(
          { message: "Forbidden" },
          { status: 403 }
        );
      }
    }

    return NextResponse.json(
      { message: "Failed to create category" },
      { status: 500 }
    );
  }
}