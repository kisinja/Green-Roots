// app/api/admin/products/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();

    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },

      include: {
        category: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ product });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Server error";

    return NextResponse.json(
      { error: msg },
      { status: msg === "Forbidden" ? 403 : 401 },
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();

    const { id } = await params;

    const data = await req.json();

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
      return NextResponse.json(
        { error: "Name, price and category are required" },
        { status: 400 },
      );
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
      typeof specifications === "object" && specifications !== null
        ? specifications
        : {};

    const product = await prisma.product.update({
      where: { id },

      data: {
        name,

        slug:
          slugify(name)
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "") +
          "-" +
          Date.now(),

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

        images: Array.isArray(images) ? images : [],
      },

      include: {
        category: true,
      },
    });

    return NextResponse.json({ product });
  } catch (err) {
    console.error(err);

    const msg = err instanceof Error ? err.message : "Server error";

    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();

    const { id } = await params;

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Server error";

    return NextResponse.json({ error: msg }, { status: 500 });
  }
}