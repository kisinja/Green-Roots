import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        const session = await getSession();

        if (!session?.userId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();

        const { productId, rating, comment } = body;
        if (!productId || !rating) {
            return NextResponse.json({ message: 'Product ID and rating are required' }, { status: 400 });
        }

        if (rating < 1 || rating > 5) {
            return NextResponse.json({ message: 'Rating must be between 1 and 5' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session?.userId },
        });
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const existingReview = await prisma.review.findUnique({
            where: {
                userId_productId: {
                    userId: session.userId,
                    productId,
                },
            }
        });
        if (existingReview) {
            return NextResponse.json({ message: 'Review already exists for this product' }, { status: 400 });
        }

        const deliveredOrder = await prisma.order.findFirst({
            where: {
                userId: session.userId,
                status: 'DELIVERED',
                items: {
                    some: {
                        productId,
                    },
                }
            }
        });

        const review = await prisma.review.create({
            data: {
                productId,
                userId: user.id,
                rating,
                comment,
                verifiedPurchase: !!deliveredOrder,
            },
        });

        const stats = await prisma.review.aggregate({
            where: { productId },
            _avg: { rating: true },
            _count: true,
        });

        await prisma.product.update({
            where: { id: productId },
            data: {
                averageRating: stats._avg.rating || 0,
                reviewCount: stats._count,
            },
        });

        return NextResponse.json(review);
    } catch (error) {
        console.log(error);

        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
    }
}