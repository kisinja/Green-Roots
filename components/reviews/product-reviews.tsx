import { prisma } from "@/lib/prisma";
import RatingStars from "./rating-stars";
import ReviewForm from "./review-form";
import ReviewList from "./review-list";

interface Props {
  productId: string;
}

export default async function ProductReviews({ productId }: Props) {
  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
    include: {
      reviews: {
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!product) return null;

  return (
    <section className="mt-16">
      <div className="flex items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold">Customer Reviews</h2>

          <div className="flex items-center gap-3 mt-2">
            <RatingStars rating={Math.round(product.averageRating)} size={24} />

            <span className="text-lg font-medium">
              {product.averageRating.toFixed(1)}
            </span>

            <span className="text-gray-500">
              ({product.reviewCount} reviews)
            </span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[350px_1fr] gap-8">
        <div>
          <ReviewForm productId={productId} />
        </div>

        <div>
          <ReviewList reviews={product.reviews} />
        </div>
      </div>
    </section>
  );
}
