// src/components/BorrowedBookCard.jsx
import Button from './Button';

const BorrowedBookCard = ({ book, onReturn, returned = false }) => {
  return (
    <div className="inline-block min-w-[200px] border p-2 rounded shadow bg-white">
      <img src={book.photo} alt={book.bookName} className="w-full h-48 object-cover rounded mb-2" />
      <p className="font-semibold">{book.bookName}</p>
      <p className="text-sm text-gray-600">
        {returned ? 'Returned' : `Return by: ${book.ret_date}`}
      </p>
      {!returned && (
        <Button label="Return Book" variant="primary" onClick={onReturn} className="mt-2" />
      )}
    </div>
  );
};

export default BorrowedBookCard;
