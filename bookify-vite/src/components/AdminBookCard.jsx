import { useState } from 'react';
import EditBookCard from './EditBookCard';

const AdminBookCard = ({ book, onSave }) => {
  const [showEdit, setShowEdit] = useState(false);

  return (
    <div
      className="bg-[rgba(var(--bookcard),1)] border rounded shadow p-4 relative transition hover:bg-[rgba(var(--card),1)] cursor-pointer"
      onClick={() => window.location.href = `/book/${book.book_id}`}
    >
      <div>
        <p className="font-semibold text-[rgba(var(--copy-primary),1)]">{book.name}</p>
        <p className="text-sm text-[rgba(var(--copy-primary),1)]">{book.author}</p>
        <p className="text-sm text-gray-500 mt-1">Available Copies: {book.available_copies}</p>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation(); 
          setShowEdit(true);
        }}
        className="absolute top-2 right-2 text-xs px-3 py-1 bg-teal-600 text-white rounded hover:bg-teal-700"
      >
        Edit
      </button>

      {showEdit && (
        <EditBookCard
          book={book}
          onClose={() => setShowEdit(false)}
          onSave={onSave}
        />
      )}
    </div>
  );
};

export default AdminBookCard;
