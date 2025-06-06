import React, { useEffect, useState } from 'react';
import { resolveBookCover } from '../utils/fetchGoogleBookCover';

const BookCard = ({ book, onClick }) => {
  const [cover, setCover] = useState(null);

  useEffect(() => {
    const loadCover = async () => {
      const image = await resolveBookCover(book);
      setCover(image);
    };
    loadCover();
  }, [book]);

  return (
    <div
      onClick={() => onClick?.(book)}
      className="bg-gray-100 rounded-lg shadow p-3 w-60 h-80 flex flex-col items-center m-2 cursor-pointer"
    >
      {!cover ? (
        <div className="w-50 h-58 bg-gray-200 animate-pulse rounded mb-2" />
      ) : (
        <img
          src={cover}
          alt={book.name}
          className="w-50 h-58 object-cover rounded mb-2"
        />
      )}
      <p className="font-semibold text-md text-center">{book.name}</p>
      <p className="text-xs text-gray-600 text-center">{book.author}</p>
    </div>
  );
};

export default BookCard;
