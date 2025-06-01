import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { ref, get, update } from 'firebase/database';

function MyWishlistPage() {
  const [user, setUser] = useState(null);
  const [wishlistBooks, setWishlistBooks] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('loggedInUser');
    if (!stored) return;

    const parsed = JSON.parse(stored);
    setUser(parsed);

    const fetchWishlist = async () => {
      const userSnap = await get(ref(db, 'users/' + parsed.userIndex + '/wishlist'));
      const wishlist = userSnap.val() || [];

      const booksSnap = await get(ref(db, 'books'));
      const allBooks = booksSnap.val() || {};

      const booksInWishlist = wishlist
        .map(bookId => allBooks[bookId])
        .filter(Boolean); // remove undefined if book not found

      setWishlistBooks(booksInWishlist);
    };

    fetchWishlist();
  }, []);

  const handleRemove = async (bookId) => {
    const userRef = ref(db, 'users/' + user.userIndex + '/wishlist');
    const snap = await get(userRef);
    const list = snap.val() || [];
    const updatedList = list.filter(id => id !== bookId);

    await update(ref(db, 'users/' + user.userIndex), {
      wishlist: updatedList
    });

    setWishlistBooks(prev => prev.filter(book => book.book_id !== bookId));
  };

  if (!user) {
    return <p className="p-6 text-red-500">You must be logged in to view your wishlist.</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4"> My Wishlist💖</h2>

      {wishlistBooks.length === 0 ? (
        <p className="text-gray-600">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {wishlistBooks.map((book) => (
            <div key={book.book_id} className="bg-white border rounded p-4 shadow relative">
              <img src={book.photo} alt={book.name} className="w-full h-60 object-cover rounded mb-2" />
              <h3 className="font-bold text-lg">{book.name}</h3>
              <p className="text-sm text-gray-600 mb-2">By {book.author}</p>
              <button
                onClick={() => handleRemove(book.book_id)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                title="Remove from wishlist"
              >
                ❌
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyWishlistPage;
