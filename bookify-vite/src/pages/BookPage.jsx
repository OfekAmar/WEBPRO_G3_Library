import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { ref, set, get, update } from 'firebase/database';
import Layout from '../Layout/Layout';
import Rating from '../components/Rating';
import CommentSection from '../components/CommentSection';
import BorrowButton from '../components/BorrowButton';
import WishlistButton from '../components/WishlistButton';
import Button from '../components/Button';

function BookPage({ user }) {
  const [book, setBook] = useState(null);
  const [message, setMessage] = useState("");
  const [inNotifyList, setInNotifyList] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [averageRating, setAverageRating] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const [inWishlist, setInWishlist] = useState(false);
  const [alreadyBorrowed, setAlreadyBorrowed] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("selectedBook");
    if (stored) setBook(JSON.parse(stored));
  }, []);

  useEffect(() => {
    const checkNotifyList = async () => {
      if (!user || !book) return;
      const snap = await get(ref(db, `users/${user.userIndex}/notify_list`));
      const list = snap.val() || [];
      setInNotifyList(list.includes(book.book_id));
    };

    const checkWishlist = async () => {
      if (!user || !book) return;
      const snap = await get(ref(db, `users/${user.userIndex}/wishlist`));
      const list = snap.val() || [];
      setInWishlist(list.includes(book.book_id));
    };

    checkNotifyList();
    checkWishlist();
  }, [user, book]);
  useEffect(() => {
  const checkIfBorrowed = async () => {
    if (!user || !book) return;

    const borrowsSnap = await get(ref(db, 'borrows'));
    const borrows = borrowsSnap.val() || {};

    const userBorrowed = Object.values(borrows).some(
      (b) =>
        b.book_id === book.book_id &&
        b.user_id === user.user_id &&
        b.status === 'borrowed'
    );

        setAlreadyBorrowed(userBorrowed);
      };

      checkIfBorrowed();
    }, [user, book]);

  useEffect(() => {
    const checkBookExtras = async () => {
      if (!book || !user) return;
      const snap = await get(ref(db, 'books/' + book.book_id));
      const bookData = snap.val();
      if (!bookData) return;

      const raters = bookData.raters || {};
      setUserRating(raters[user.userIndex] || 0);
      setAverageRating(bookData.rate || null);
      setComments(bookData.comments || []);
    };

    checkBookExtras();
  }, [book, user]);

  const toggleNotifyList = async () => {
    const userRef = ref(db, `users/${user.userIndex}/notify_list`);
    const snap = await get(userRef);
    const list = snap.val() || [];

    const updatedList = list.includes(book.book_id)
      ? list.filter(id => id !== book.book_id)
      : [...list, book.book_id];

    await update(ref(db, `users/${user.userIndex}`), { notify_list: updatedList });
    setInNotifyList(updatedList.includes(book.book_id));
  };

  const toggleWishlist = async () => {
    const userRef = ref(db, `users/${user.userIndex}/wishlist`);
    const snap = await get(userRef);
    const list = snap.val() || [];

    const updatedList = list.includes(book.book_id)
      ? list.filter(id => id !== book.book_id)
      : [...list, book.book_id];

    await update(ref(db, `users/${user.userIndex}`), { wishlist: updatedList });
    setInWishlist(updatedList.includes(book.book_id));
  };

const handleRating = async (rating) => {
  if (!user || !book) return;

  try {
    const bookRef = ref(db, `books/${book.book_id}`);
    const snap = await get(bookRef);
    const data = snap.val();

    const raters = data.raters || {};
    raters[user.userIndex] = rating;

    const ratings = Object.values(raters);
    const avgRating = (ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(1);

    await update(bookRef, {
      raters,
      rate: parseFloat(avgRating)
    });

    setUserRating(rating);
    setAverageRating(parseFloat(avgRating));
  } catch (err) {
    console.error("Failed to update rating:", err);
    setMessage("❌ Error saving rating.");
  }
};

const handleAddComment = async (comment) => {
  try {
    const updated = [...comments, comment];
    setComments(updated);

    await update(ref(db, 'books/' + book.book_id), {
      comments: updated
    });
  } catch (err) {
    console.error("Failed to add comment:", err);
    setMessage("❌ Error saving comment.");
  }
};
 const handleBorrow = async () => {
  if (!user || !book) return;

  // 1. Get management index
  const mgmtRef = ref(db, 'managment');
  const mgmtSnap = await get(mgmtRef);
  const currentIndex = mgmtSnap.val()?.borrows_index || 0;
  const newIndex = currentIndex + 1;

  const today = new Date();
  const returnDate = new Date();
  returnDate.setDate(today.getDate() + 7); // 7 days borrow

  const newBorrow = {
    borrow_id: newIndex,
    user_id: user.user_id,
    book_id: book.book_id,
    status: 'borrow',
    b_date: today.toISOString().split('T')[0],
    ret_date: returnDate.toISOString().split('T')[0]
  };

  // 2. Save borrow record
  await set(ref(db, `borrows/${newIndex}`), newBorrow);

  // 3. Update available copies
  await update(ref(db, `books/${book.book_id}`), {
    available_copies: (book.available_copies || 1) - 1
  });

  // 4. Update borrows_index
  await update(mgmtRef, { borrows_index: newIndex });

  // 5. Update local state
  setMessage("Book borrowed successfully!");
  setBook(prev => ({
    ...prev,
    available_copies: (prev.available_copies || 1) - 1
  }));
};

  if (!book) return <p className="p-4 text-red-500">No book selected</p>;

  return (
    
      <div className="max-w-3xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">{book.name}</h2>
        <img src={book.photo} alt={book.name} className="w-52 h-72 mb-4 rounded shadow" />
        <p className="mb-2"><strong>Author:</strong> {book.author}</p>
        <p className="mb-4"><strong>Description:</strong> {book.description}</p>
        <p className="text-sm text-gray-600">Location on shelf 📍: {book.location}</p>

        {user ? (
          <div className="mt-4 space-y-3">
            {book.available_copies > 0 ? (
              alreadyBorrowed ? (
                <p className="text-green-600 font-semibold">📚 You already borrowed this book</p>
              ) : (
                <BorrowButton isBorrowed={false} onToggle={handleBorrow} />
              )
            ) : (
              <Button
                label={inNotifyList ? 'Remove from Notify List 🔕' : 'Add to Notify List 🔔'}
                onClick={toggleNotifyList}
                variant="secondary"
              />
            )}

            <WishlistButton isWished={inWishlist} onToggle={toggleWishlist} />

            {message && <p className="mt-2 text-green-600">{message}</p>}
          </div>
        ) : (
          <p className="text-red-500 font-semibold mt-4">Login to borrow</p>
        )}

        <div className="mt-6">
          <h3 className="text-lg font-semibold">Rating ⭐: {averageRating !== null ? `${averageRating}/5` : 'No rating yet'}</h3>
          <Rating value={userRating} onRate={handleRating} />
          {userRating !== 0 && <p className="text-sm text-gray-600 mt-1">Your rate: {userRating}</p>}
        </div>

        <CommentSection
          comments={comments}
          userName={user?.name || user?.username}
          onPostComment={handleAddComment}
        />
      </div>
    
  );
}

export default BookPage;
