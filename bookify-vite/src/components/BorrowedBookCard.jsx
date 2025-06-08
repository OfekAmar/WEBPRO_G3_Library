// src/components/BorrowedBookCard.jsx
import Button from './Button';

const BorrowedBookCard = ({ book, onReturn, returned = false }) => {
  return (
    <div className="bg-gray-100 rounded-lg shadow p-3 w-[240px] h-[320px] flex flex-col items-center m-2 cursor-default">
      <img
        src={book.photo}
        alt={book.bookName}
        className="w-[200px] h-[232px] object-cover rounded mb-2"
      />
      <p className="font-semibold text-md text-center">{book.bookName}</p>
      <p className="text-xs text-gray-600 text-center mt-1">
        {returned ? 'Returned' : `Return by: ${book.ret_date}`}
      </p>
      {!returned && (
        <Button
          label="Return Book"
          variant="primary"
          onClick={onReturn}
          className="mt-2 text-sm"
        />
      )}
    </div>
  );
};

export default BorrowedBookCard;
