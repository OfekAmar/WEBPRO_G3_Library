import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { ref, get, update } from 'firebase/database';
import Layout from '../Layout/Layout';
import NotifyBookCard from '../components/NotifyBookCard';

function MyNotifyListPage({ user }) {
  const [notifyBooks, setNotifyBooks] = useState([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (!user) return;

    const fetchNotifyList = async () => {
      
      const notifySnap = await get(ref(db, `users/${user.userIndex}/notify_list`));
      const notifyList = notifySnap.val() || [];

      const booksSnap = await get(ref(db, 'books'));
      const books = booksSnap.val() || {};

      const foundBooks = notifyList
        .map(id => books[id])
        .filter(book => book);

      setNotifyBooks(foundBooks);
    };

    fetchNotifyList();
  }, [user]);

  const removeFromNotifyList = async (bookId) => {
    const userIndex = user.userIndex;
    const userRef = ref(db, `users/${userIndex}/notify_list`);
    const snap = await get(userRef);
    const currentList = snap.val() || {};

    const updatedList = currentList.filter(id => id !== bookId);

    await update(ref(db, `users/${userIndex}`), {
      notify_list: updatedList,
    });

    setNotifyBooks(prev => prev.filter(book => book.book_id !== bookId));
    setMsg('Book removed from notify list!');
    setTimeout(() => setMsg(''), 3000);
  };

  if (!user) {
    return <p className="text-red-500 p-4">You must be logged in to view your notify list.</p>;
  }

  return (
    
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">My Notify List 🔔</h2>
        {msg && <p className="text-green-600 mb-4">{msg}</p>}

        {notifyBooks.length === 0 ? (
          <p className="text-gray-600">Your notify list is empty.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {notifyBooks.map((book, i) => (
              <NotifyBookCard key={i} book={book} onRemove={() => removeFromNotifyList(book.book_id)} />
            ))}
          </div>
        )}
      </div>
    
  );
}

export default MyNotifyListPage;
