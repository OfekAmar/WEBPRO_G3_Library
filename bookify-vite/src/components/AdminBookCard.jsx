import { useNavigate } from 'react-router-dom';
import Button from './Button';

const AdminBookCard = ({ book, onAddCopies }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/book/${book.book_id}`)}
      className="bg-white border rounded shadow p-4 relative transition hover:bg-gray-50 cursor-pointer"
    >
      <div className="text-sm text-gray-600 mb-1">
        <strong>{book.name}</strong> by {book.author}
      </div>
      <p className="text-xs text-gray-500 mb-2">
        Available Copies: {book.available_copies ?? 0}
      </p>
      <Button
        label="Add Copy"
        onClick={(e) => {
          e.stopPropagation(); // prevent navigation
          onAddCopies?.(book);
        }}
        variant="teal"
        size="sm"
      />
    </div>
  );
};

export default AdminBookCard;
