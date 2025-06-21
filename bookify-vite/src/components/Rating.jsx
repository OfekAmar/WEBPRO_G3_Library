import { useState } from 'react';

const Rating = ({ average = 0, reviewCount = 0, onOpenReviews }) => {
  return (
    <div className="flex flex-col gap-1 mb-4">
      <div className="flex gap-1 text-orange-400 text-xl">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={average >= star ? '' : 'text-gray-300'}>
            ★
          </span>
        ))}
        <button
          onClick={onOpenReviews}
          className="text-blue-600 text-xl hover:underline ml-2"
          type="button"
        >
          ({reviewCount} Review{reviewCount !== 1 ? 's' : ''})
        </button>
      </div>
    </div>
  );
};

export default Rating;