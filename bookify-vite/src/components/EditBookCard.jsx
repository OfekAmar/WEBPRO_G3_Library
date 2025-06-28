import { useState } from 'react';
import { update, ref } from 'firebase/database';
import { db } from '../firebase';
import Button from './Button';

const EditBookCard = ({ book, onClose, onSave }) => {
  const [location, setLocation] = useState(book.location || '');
  const [editAmount, setEditAmount] = useState(0);
  const [message, setMessage] = useState('');

  const maxRemovable = book.available_copies;

  const handleSave = async () => {
  const currentAvailable = book.available_copies ?? 0;
  const currentTotal = book.copies ?? 0;

  const newAvailable = currentAvailable + editAmount;
  const newTotalCopies = currentTotal + editAmount;

  if (newAvailable < 0 || newTotalCopies < 0) return;

  const bookRef = ref(db, `books/${book.book_id}`);
  await update(bookRef, {
    location,
    available_copies: newAvailable,
    copies: newTotalCopies
  });

  setMessage('Book updated!');
  onSave?.({
    ...book,
    location,
    available_copies: newAvailable,
    copies: newTotalCopies
  });

  setTimeout(() => {
    setMessage('');
    onClose?.();
  }, 1000);
};

  const handleEditAmountChange = (e) => {
    const val = parseInt(e.target.value, 10);
    if (isNaN(val)) return setEditAmount(0);
    if (val < -maxRemovable) return setEditAmount(-maxRemovable);
    setEditAmount(val);
  };

  const updatedTotal = book.available_copies + editAmount;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">Edit Book</h2>

        <label className="block text-sm font-semibold mb-1">Location</label>
        <input
          type="text"
          className="border w-full p-2 rounded mb-4"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <label className="block text-sm font-semibold mb-1">Modify Available Copies</label>
        <input
          type="number"
          className="border w-full p-2 rounded mb-2"
          value={editAmount}
          onChange={handleEditAmountChange}
        />
        <p className="text-sm text-gray-600 mb-4">
          Current: {book.available_copies} → New Total: {updatedTotal}
        </p>

        {message && <p className="text-green-600 text-sm mb-3">{message}</p>}

        <div className="flex justify-end gap-2">
          <Button label="Cancel" variant="outline" onClick={onClose} />
          <Button label="Save" variant="teal" onClick={handleSave} />
        </div>
      </div>
    </div>
  );
};

export default EditBookCard;
