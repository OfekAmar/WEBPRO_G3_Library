// src/components/NotifyBookCard.jsx
import Button from './Button';

const NotifyBookCard = ({ book, onRemove }) => {
  return (
    <div className="border p-2 rounded shadow bg-white">
      <img
        src={book.photo}
        alt={book.name}
        className="w-full h-48 object-cover rounded mb-2"
      />
      <p className="font-semibold">{book.name}</p>
      <p className="text-sm text-gray-600">{book.author}</p>
      <Button
        label="Remove"
        variant="danger"
        onClick={onRemove}
        className="mt-2"
      />
    </div>
  );
};

export default NotifyBookCard;
