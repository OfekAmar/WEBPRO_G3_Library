import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { ref, get, update } from 'firebase/database';

function MyNotifyListPage() {
  const [notifyBooks, setNotifyBooks] = useState([]);
  const [user, setUser] = useState(null);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem("loggedInUser");
    if (!stored) return;

    const parsed = JSON.parse(stored);
    setUser(parsed);

    const fetchNotifyList = async () => {
      const userIndex = parsed.userIndex;
      const notifySnap = await get(ref(db, 'users/' + userIndex + '/notify_list'));
      const notifyList = notifySnap.val() || [];

      const booksSnap = await get(ref(db, 'books'));
      const books = booksSnap.val() || [];

      const foundBooks = notifyList
        .map(id => books[id])
        .filter(book => book); // remove undefined

      setNotifyBooks(foundBooks);
    };

    fetchNotifyList();
  }, []);

  if (!user) return <p className="text-red-500 p-4">You must be logged in to view your notify List.</p>;
  
  const removeFromNotifyList  = async (bookId) => {
  const userIndex = user.userIndex;
  const userRef = ref(db, 'users/' + userIndex + '/notify_list');
  const snap = await get(userRef);
  const currentList = snap.val() || [];

  const updatedList = currentList.filter(id => id !== bookId);

  await update(ref(db, 'users/' + userIndex), {
    notify_list: updatedList
  });

  setNotifyBooks(prev => prev.filter(book => book.book_id !== bookId));
  setMsg("Book removed from notify list!");
  setTimeout(() => setMsg(''), 3000);
};

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Notify List🔔</h2>
      {msg && <p className="text-green-600 mb-4">{msg}</p>}
      {notifyBooks.length === 0 ? (
        <p className="text-gray-600">Your notify list is empty.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {notifyBooks.map((book, i) => (
             <div key={i} className="border p-2 rounded shadow">
              <img src={book.photo} alt={book.name} className="w-full h-48 object-cover rounded mb-2" />
              <p className="font-semibold">{book.name}</p>
              <p className="text-sm text-gray-600">{book.author}</p>
              <button
                onClick={() => removeFromNotifyList (book.book_id)}
                className="mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyNotifyListPage;
