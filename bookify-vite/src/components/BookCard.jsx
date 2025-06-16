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
      className="bg-[rgba(var(--bookcard),1)] hover:bg-[rgba(var(--bookcard),0.85)] text-copy-primary rounded-lg shadow p-3 w-44 h-72 flex flex-col items-center m-2 cursor-pointer transition-colors"
    >
      {!cover ? (
        <div className="w-40 h-48 bg-border animate-pulse rounded mb-2" />
      ) : (
        <img
          src={cover}
          alt={book.name}
          className="w-[160px] h-[200px] object-cover rounded mb-2"
        />
      )}
      <p className="font-semibold text-md text-center">{book.name}</p>
      <p className="text-xs text-copy-secondary text-center">{book.author}</p>
    </div>
  );
};

export default BookCard;