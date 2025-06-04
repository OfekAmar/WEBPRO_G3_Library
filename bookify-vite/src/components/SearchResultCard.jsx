// src/components/SearchResultCard.jsx
import Button from './Button';
import { db } from '../firebase';
import { ref, get, update } from 'firebase/database';


const SearchResultCard = ({ book, navigate }) => {
  const handleNotifyClick = async () => {
    const storedUser = localStorage.getItem("loggedInUser");
    if (!storedUser) return alert("Please log in to add to notify list.");

    const user = JSON.parse(storedUser);
    const userIndex = user.userIndex;

    const userRef = ref(db, `users/${userIndex}/notify_list`);
    const snap = await get(userRef);
    const current = snap.val() || [];

    if (current.includes(book.book_id)) {
      alert("Already in your notify list.");
      return;
    }

    const updatedList = [...current, book.book_id];
    await update(ref(db, `users/${userIndex}`), { notify_list: updatedList });
    alert("Book added to notify list!");
  };

  return (
    <div className="cursor-pointer border p-2 rounded shadow hover:shadow-md bg-white">
      <img
        src={book.photo}
        alt={book.name}
        className="w-full h-48 object-cover rounded"
        onClick={() => {
          sessionStorage.setItem("selectedBook", JSON.stringify(book));
          navigate("/book");
        }}
      />
      <p className="mt-2 text-sm font-semibold">{book.name}</p>
      <p className="text-xs text-gray-600">{book.author} ({book.year})</p>
      <p className="text-xs text-gray-500">Location 📍: {book.location}</p>

      {book.available_copies === 0 && (
        <Button
          label="Add to Notify List 🔔"
          variant="secondary"
          onClick={handleNotifyClick}
          className="mt-2 text-xs"
        />
      )}
    </div>
  );
};

export default SearchResultCard;
