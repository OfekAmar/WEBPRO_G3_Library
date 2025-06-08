import { useState } from 'react';

{/*
const Rating = ({ value = 0, onRate, readOnly = false }) => {
  const [hovered, setHovered] = useState(null);

  const handleClick = (rating) => {
    if (!readOnly) onRate?.(rating);
  };

  return (
    <div className="flex gap-1 text-yellow-500 text-xl">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => handleClick(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(null)}
          className={`focus:outline-none ${
            (hovered ?? value) >= star ? '' : 'text-gray-300'
          }`}
        >
          ★
        </button>
      ))}
    </div>
  );
};

export default Rating;
*/}

const Rating = ({ average = 0, userRating = 0, reviewCount = 0, onOpenReviews }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(i <= average ? '★' : '☆');
  }

  return (
    <div className="flex items-center gap-2 mb-4 text-sm">
      {stars.map((s, i) => (
        <span key={i} className="text-orange-400 text-lg">{s}</span>
      ))}
      <button
        onClick={onOpenReviews}
        className="text-blue-600 hover:underline ml-2"
        type="button"
      >
        ({reviewCount} Customer Review{reviewCount !== 1 ? 's' : ''})
      </button>
    </div>
  );
};

export default Rating;