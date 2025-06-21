// src/components/BorrowedBookCard.jsx
import BookCard from './BookCard';
import Buttonn from './Buttonn';

const BorrowedBookCard = ({ book, onReturn }) => {
  return (
    <div className="flex flex-col items-center gap-2 w-fit">
      {/* Book visual */}
      <BookCard book={book} onClick={() => window.location.href = `/book/${book.book_id}`} />

      {/* Return by text */}
      <p className="text-sm text-gray-600 mt-1">Return by: {book.ret_date}</p>

      {/* Return button */}
      <Buttonn
        isBorrowed={true}
        onToggle={() => onReturn(book)}
        className='text-sm'
      />
    </div>
  );
};

export default BorrowedBookCard;
