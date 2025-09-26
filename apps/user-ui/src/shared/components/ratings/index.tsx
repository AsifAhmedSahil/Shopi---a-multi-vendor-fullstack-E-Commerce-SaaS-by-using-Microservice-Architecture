import React from "react";

type Props = {
  rating: number;
};

const ProductRating: React.FC<Props> = ({ rating }) => {
  const MAX_STARS = 5;

  // Convert rating to array of full, half, and empty stars
  const getStars = () => {
    const fullStars = Math.floor(rating);
    const halfStar = rating - fullStars >= 0.5;
    const emptyStars = MAX_STARS - fullStars - (halfStar ? 1 : 0);

    return {
      full: fullStars,
      half: halfStar ? 1 : 0,
      empty: emptyStars,
    };
  };

  const stars = getStars();

  return (
    <div className="flex items-center gap-0.5 text-yellow-400 text-sm">
      {[...Array(stars.full)].map((_, i) => (
        <span key={`full-${i}`}>★</span>
      ))}

      {stars.half === 1 && <span key="half">⯨</span>}

      {[...Array(stars.empty)].map((_, i) => (
        <span key={`empty-${i}`} className="text-gray-300">
          ★
        </span>
      ))}
    </div>
  );
};

export default ProductRating;
