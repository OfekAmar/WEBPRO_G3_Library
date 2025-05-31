import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { ref, get } from 'firebase/database';

function MyWishlistPage() {
  const [wishlistBooks, setWishlistBooks] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("loggedInUser");
    if (!stored) return;

    const parsed = JSON.parse(stored);
    setUser(parsed);

    const fetchWishlist = async () => {
      const userIndex = parsed.userIndex;
      const wishSnap = await get(ref(db, 'users/' + userIndex + '/wish_list'));
      const wishList = wishSnap.val() || [];

      const booksSnap = await get(ref(db, 'books'));
      const books = booksSnap.val() || [];

      const foundBooks = wishList
        .map(id => books[id])
        .filter(book => book); // remove undefined

      setWishlistBooks(foundBooks);
    };

    fetchWishlist();
  }, []);

  if (!user) return <p className="text-red-500 p-4">You must be logged in to view your wishlist.</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">💖 My Wishlist</h2>
      {wishlistBooks.length === 0 ? (
        <p className="text-gray-600">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {wishlistBooks.map((book, i) => (
            <div key={i} className="border p-2 rounded shadow">
              <img src={book.photo} alt={book.name} className="w-full h-48 object-cover rounded mb-2" />
              <p className="font-semibold">{book.name}</p>
              <p className="text-sm text-gray-600">{book.author}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyWishlistPage;
