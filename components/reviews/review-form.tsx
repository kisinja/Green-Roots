"use client";

import { useState } from "react";
import { showToast } from "../ui/Toaster";

interface Props {
  productId: string;
}

export default function ReviewForm({ productId }: Props) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  async function submitReview() {
    try {
      setLoading(true);

      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          rating,
          comment,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.error, "error");
        return;
      }

      showToast("Review submitted!", "success");

      window.location.reload();
    } catch (error) {
      showToast("Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border rounded-2xl p-5 bg-white">
      <h3 className="text-lg font-semibold mb-4">Leave a Review</h3>

      <div className="flex gap-2 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(star)}
            className={`text-3xl ${
              star <= rating ? "text-yellow-500" : "text-gray-300"
            }`}
          >
            ★
          </button>
        ))}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write your review..."
        className="w-full border rounded-xl p-3 min-h-[120px]"
      />

      <button
        onClick={submitReview}
        disabled={loading}
        className="mt-4 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl"
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </div>
  );
}
