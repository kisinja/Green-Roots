import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import slugify from "slugify";

interface RouteContext {
    params: Promise<{
        id: string;
    }>;
}

// ✅ GET SINGLE CATEGORY
export async function GET(
    req: NextRequest,
    context: RouteContext
) {
    try {
        const { id } = await context.params;

        const category = await prisma.category.findUnique({
            where: {
                id,
            },
            include: {
                products: true,
            },
        });

        if (!category) {
            return NextResponse.json(
                { message: "Category not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(category);
    } catch (error) {
        console.error("GET CATEGORY ERROR:", error);

        return NextResponse.json(
            { message: "Failed to fetch category" },
            { status: 500 }
        );
    }
}

// ✅ UPDATE CATEGORY
export async function PATCH(
    req: NextRequest,
    context: RouteContext
) {
    try {
        // 🔒 ADMIN ONLY
        await requireAdmin();

        const { id } = await context.params;

        const body = await req.json();

        const { name, emoji } = body;

        const existingCategory = await prisma.category.findUnique({
            where: {
                id,
            },
        });

        if (!existingCategory) {
            return NextResponse.json(
                { message: "Category not found" },
                { status: 404 }
            );
        }

        let slug = existingCategory.slug;

        if (name) {
            slug = slugify(name, {
                lower: true,
                strict: true,
                trim: true,
            });

            const duplicate = await prisma.category.findFirst({
                where: {
                    slug,
                    NOT: {
                        id,
                    },
                },
            });

            if (duplicate) {
                return NextResponse.json(
                    { message: "Another category already uses this name" },
                    { status: 409 }
                );
            }
        }

        const updatedCategory = await prisma.category.update({
            where: {
                id,
            },
            data: {
                name: name || existingCategory.name,
                emoji: emoji || existingCategory.emoji,
                slug,
            },
        });

        return NextResponse.json(updatedCategory);
    } catch (error) {
        console.error("UPDATE CATEGORY ERROR:", error);

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
            { message: "Failed to update category" },
            { status: 500 }
        );
    }
}

// ✅ DELETE CATEGORY
export async function DELETE(
    req: NextRequest,
    context: RouteContext
) {
    try {
        // 🔒 ADMIN ONLY
        await requireAdmin();

        const { id } = await context.params;

        const category = await prisma.category.findUnique({
            where: {
                id,
            },
            include: {
                products: true,
            },
        });

        if (!category) {
            return NextResponse.json(
                { message: "Category not found" },
                { status: 404 }
            );
        }

        // 🚫 Prevent deleting categories with products
        if (category.products.length > 0) {
            return NextResponse.json(
                {
                    message:
                        "Cannot delete category with existing products",
                },
                { status: 400 }
            );
        }

        await prisma.category.delete({
            where: {
                id,
            },
        });

        return NextResponse.json({
            message: "Category deleted successfully",
        });
    } catch (error) {
        console.error("DELETE CATEGORY ERROR:", error);

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
            { message: "Failed to delete category" },
            { status: 500 }
        );
    }
}