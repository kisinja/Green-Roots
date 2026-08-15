import { prisma } from "@/lib/prisma";
import RatingStars from "./rating-stars";
import ReviewForm from "./review-form";
import ReviewList from "./review-list";
import { getSession } from "@/lib/auth";

interface Props {
  productId: string;
}

export default async function ProductReviews({ productId }: Props) {
  // ✅ getSession() returns null for guests instead of throwing —
  // this section must render for both logged-in users and guests.
  const session = await getSession();

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

  const userId = session?.userId ?? null;

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
          {userId ? (
            <ReviewForm productId={productId} />
          ) : (
            <div className="rounded-2xl border border-black/5 bg-[var(--green-50)] p-6 text-sm text-black/60">
              <p className="mb-3">Sign in to leave a review.</p>
              <a
                href={`/login?redirect=/product/${productId}`}
                className="inline-block rounded-xl bg-[var(--green-700)] px-4 py-2 font-semibold text-white transition hover:bg-[var(--green-800)]"
              >
                Sign In
              </a>
            </div>
          )}
        </div>

        <div>
          <ReviewList reviews={product.reviews} />
        </div>
      </div>
    </section>
  );
}
