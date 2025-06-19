import { useState } from 'react';

const UserRating = ({ userRating = 0, reviewCount = 0, onRate, onOpenReviews }) => {
  const [hovered, setHovered] = useState(null);

  const handleClick = (rating) => {
    if (onRate) onRate(rating);
  };

  return (
    <div className="flex flex-col gap-1 mb-4">
      {/* Interactive Stars */}
      <div className="flex gap-1 text-orange-400 text-xl">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleClick(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(null)}
            className={`focus:outline-none ${
              (hovered ?? userRating) >= star ? '' : 'text-gray-300'
            }`}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  );
};

export default UserRating;