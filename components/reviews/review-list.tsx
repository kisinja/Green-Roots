import RatingStars from "./rating-stars";

interface Review {
  id: string;
  rating: number;
  comment?: string | null;
  verifiedPurchase: boolean;
  createdAt: Date | string;
  user: {
    name: string;
  };
}

interface Props {
  reviews: Review[];
}

export default function ReviewList({ reviews }: Props) {
  return (
    <div className="space-y-5">
      {reviews.map((review) => (
        <div key={review.id} className="border rounded-2xl p-5 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">{review.user.name}</p>

              <div className="flex items-center gap-3 mt-1">
                <RatingStars rating={review.rating} />

                {review.verifiedPurchase && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    Verified Purchase
                  </span>
                )}
              </div>
            </div>

            <p className="text-sm text-gray-500">
              {new Date(review.createdAt).toLocaleDateString()}
            </p>
          </div>

          {review.comment && (
            <p className="mt-4 text-gray-700 leading-relaxed">
              {review.comment}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
