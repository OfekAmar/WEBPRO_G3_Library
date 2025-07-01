// src/components/BorrowedBookCard.jsx
import BookCard from './BookCard';
import Buttonn from './Buttonn';

const BorrowedBookCard = ({ book, onReturn }) => {
  return (
    <div className="flex flex-col items-center gap-2 w-fit">
      <BookCard book={book} onClick={() => window.location.href = `/book/${book.book_id}`} />
      <p className="text-sm text-gray-600 mt-1">Return by: {book.ret_date}</p>
      <Buttonn
        isBorrowed={true}
        onToggle={() => onReturn(book)}
        className='text-sm'
      />
    </div>
  );
};

export default BorrowedBookCard;
