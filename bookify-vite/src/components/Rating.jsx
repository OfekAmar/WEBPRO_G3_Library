import { useState } from 'react';

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
