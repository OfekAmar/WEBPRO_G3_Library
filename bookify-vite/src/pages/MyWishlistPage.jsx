import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { ref, get, update } from 'firebase/database';
import Layout from '../Layout/Layout';
import WishlistBookCard from '../components/WishlistBookCard';

function MyWishlistPage({ user }) {
  const [wishlistBooks, setWishlistBooks] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchWishlist = async () => {
      const userSnap = await get(ref(db, `users/${user.userIndex}/wishlist`));
      const wishlist = userSnap.val() || [];

      const booksSnap = await get(ref(db, 'books'));
      const allBooks = booksSnap.val() || {};

      const booksInWishlist = wishlist
        .map(bookId => allBooks[bookId])
        .filter(Boolean);

      setWishlistBooks(booksInWishlist);
    };

    fetchWishlist();
  }, [user]);

  const handleRemove = async (bookId) => {
    const userRef = ref(db, `users/${user.userIndex}/wishlist`);
    const snap = await get(userRef);
    const list = snap.val() || [];
    const updatedList = list.filter(id => id !== bookId);

    await update(ref(db, `users/${user.userIndex}`), {
      wishlist: updatedList
    });

    setWishlistBooks(prev => prev.filter(book => book.book_id !== bookId));
  };

  if (!user) {
    return <p className="p-6 text-red-500">You must be logged in to view your wishlist.</p>;
  }

  return (

      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">My Wishlist 💖</h2>

        {wishlistBooks.length === 0 ? (
          <p className="text-gray-600">Your wishlist is empty.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {wishlistBooks.map((book) => (
              <WishlistBookCard key={book.book_id} book={book} onRemove={() => handleRemove(book.book_id)} />
            ))}
          </div>
        )}
      </div>

  );
}

export default MyWishlistPage;
