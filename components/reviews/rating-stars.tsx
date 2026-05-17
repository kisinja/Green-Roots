import React from "react";

interface Props {
  rating: number;
  size?: number;
}

const RatingStars = ({ rating, size = 18 }: Props) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((str) => (
        <span
          key={str}
          style={{ fontSize: size }}
          className={str <= rating ? "text-yellow-500" : "text-gray-300"}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default RatingStars;
