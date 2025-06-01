import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { ref, set, get, update } from 'firebase/database';

function BookPage() {
  const [book, setBook] = useState(null);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [inNotifyList, setInNotifyList] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [averageRating, setAverageRating] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const [inWishlist, setInWishlist] = useState(false);
  

  useEffect(() => {
    const stored = sessionStorage.getItem("selectedBook");
    const loggedIn = localStorage.getItem("loggedInUser");

    if (stored) setBook(JSON.parse(stored));
    if (loggedIn) setUser(JSON.parse(loggedIn));

  }, []);

  useEffect(() => {
  const checkNotifyList = async () => {
    if (!user || !book) return;
    const snap = await get(ref(db, 'users/' + user.userIndex + '/notify_list'));
    const list = snap.val() || [];
    setInNotifyList(list.includes(book.book_id));
  };

  const checkWishlist = async () => {
    if (!user || !book) return;
    const snap = await get(ref(db, 'users/' + user.userIndex + '/wishlist'));
    const list = snap.val() || [];
    setInWishlist(list.includes(book.book_id));
  };

  checkNotifyList();
  checkWishlist();
}, [user, book]);
useEffect(() => {
  const checkBookExtras = async () => {
    if (!book || !user) return;
    const snap = await get(ref(db, 'books/' + book.book_id));
    const bookData = snap.val();
    if (!bookData) return;

    const raters = bookData.raters || {};
    const userRatedValue = raters[user.userIndex] || 0;
    setUserRating(userRatedValue); // this sets actual rating if present
    setAverageRating(bookData.rate || null);
    setComments(bookData.comments || []);
  };

  checkBookExtras();
}, [book, user]);

const toggleNotifyList  = async () => {
    const userRef = ref(db, 'users/' + user.userIndex + '/notify_list');
    const snap = await get(userRef);
    const list = snap.val() || [];

  let updatedList;
  if (list.includes(book.book_id)) {
    updatedList = list.filter(id => id !== book.book_id);
    setInNotifyList(false);
  } else {
    updatedList = [...list, book.book_id];
    setInNotifyList(true);
  }

  await update(ref(db, 'users/' + user.userIndex), {
    notify_list: updatedList
  });
};
const toggleWishlist = async () => {
  const userRef = ref(db, 'users/' + user.userIndex + '/wishlist');
  const snap = await get(userRef);
  const list = snap.val() || [];

  let updatedList;
  if (list.includes(book.book_id)) {
    updatedList = list.filter(id => id !== book.book_id);
    setInWishlist(false);
  } else {
    updatedList = [...list, book.book_id];
    setInWishlist(true);
  }

  await update(ref(db, 'users/' + user.userIndex), {
    wishlist: updatedList
  });
};
const handleRating = async (rating) => {
  if (!user || !book) return;

  const bookRef = ref(db, 'books/' + book.book_id);
  const snap = await get(bookRef);
  const bookData = snap.val() || {};

  const raters = bookData.raters || {};
  const previousRating = raters[user.userIndex];

  // If the user already rated, update instead of adding
  if (previousRating === rating) return; // same value → no update

  const totalRaters = Object.keys(raters).length;
  const currentTotal = (bookData.rate || 0) * totalRaters;
  const updatedTotal = previousRating
    ? currentTotal - previousRating + rating
    : currentTotal + rating;
  const newRaterCount = previousRating ? totalRaters : totalRaters + 1;
  const newAvg = +(updatedTotal / newRaterCount).toFixed(1);

  // Save updated raters object
  const updatedRaters = { ...raters, [user.userIndex]: rating };

  await update(bookRef, {
    rate: newAvg,
    raters: updatedRaters
  });

  setUserRating(rating);
  setAverageRating(newAvg);
};

const handleAddComment = async () => {
  if (!commentText.trim()) return;

  const bookRef = ref(db, 'books/' + book.book_id);
  const snap = await get(bookRef);
  const bookData = snap.val() || {};
  const oldComments = bookData.comments || [];

  const newComment = {
    name: user.name || user.username,
    text: commentText
  };

  await update(bookRef, {
    comments: [...oldComments, newComment]
  });

  setComments(prev => [...prev, newComment]);
  setCommentText('');
};
  const borrowBook = async () => {
    if (!user || !book) return;

    const booksSnapshot = await get(ref(db, 'books'));
    const books = booksSnapshot.val();

    const bookId = book.book_id;

    if (!bookId) {
      setMessage("Book ID not found");
      return;
    }

    // Check available copies
    const available = books[bookId].available_copies;
    if (available <= 0) {
      setMessage("This book is currently unavailable");
      return;
    }

    // Get user ID
    const usersSnapshot = await get(ref(db, 'users'));
    const users = usersSnapshot.val();
    let userId = null;
    for (let i = 1; i < users.length; i++) {
    if (users[i]?.email === user.username) {
        userId = users[i].user_id;
        break;
    }
    }

    if (!userId) {
      setMessage("User ID not found");
      return;
    }

    // Check if user already borrowed this book and it's still active
    const borrowsSnapshot = await get(ref(db, 'borrows'));
    const allBorrows = Object.values(borrowsSnapshot.val() || {});
    const alreadyBorrowed = allBorrows.some(
      b => b.book_id === bookId && b.user_id === userId && b.status === 'borrow'
    );

    if (alreadyBorrowed) {
      setMessage("You've already borrowed this book");
      return;
    }

    // Add borrow record
    const mgmtSnap = await get(ref(db, 'managment/borrows_index'));
    const newBorrowId = mgmtSnap.val() + 1;
    const today = new Date();
    const returnDate = new Date(today);
    returnDate.setDate(today.getDate() + 10);

    const borrowEntry = {
        borrow_id: newBorrowId,
        b_date: today.toISOString().split('T')[0],
        ret_date: returnDate.toISOString().split('T')[0],
        status: 'borrow',
        book_id: bookId,
        user_id: userId
    };

    await set(ref(db, `borrows/${newBorrowId}`), borrowEntry);
    await update(ref(db, 'managment'), { borrows_index: newBorrowId });

    // Decrease available copies
    await update(ref(db, `books/${bookId}`), {
      available_copies: available - 1
    });
    alert(`The book "${book.name}" was successfully borrowed✅. \nThe return date is ${returnDate.toISOString().split('T')[0]}. Any delay will result in a late fee.`);

    const formattedDate = returnDate.toLocaleDateString('en-GB');
    setMessage(`✅ The book "${book.name}" was successfully borrowed. The return date is ${formattedDate}. Any delay will result in a late fee.`);
  };

  if (!book) return <p className="p-4 text-red-500">No book selected</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">{book.name}</h2>
      <img src={book.photo} alt={book.name} className="w-52 h-72 mb-4 rounded shadow" />
      <p className="mb-2"><strong>Author:</strong> {book.author}</p>
      <p className="mb-4"><strong>Description:</strong> {book.description}</p>
      <p className="text-sm text-gray-600"> Location on shelf📍: {book.location}</p>


      {user ? (
  <>
    {book.available_copies > 0 ? (
      <button
        onClick={borrowBook}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Borrow This Book
      </button>
    ) : (
      <button
        onClick={toggleNotifyList}
        className="bg-purple-500 text-white px-4 py-2 rounded"
      >
        {inNotifyList ? 'Remove from Notify List 🔕' : 'Add to Notify List 🔔'}
      </button>
    )}
    <button
      onClick={toggleWishlist}
      className="mt-2 bg-pink-500 text-white px-4 py-2 rounded"
    >
      {inWishlist ? '💔 Remove from Wishlist' : '💖 Add to Wishlist'}
    </button>

    {message && <p className="mt-4 text-green-600">{message}</p>}
  </>
) : (
  <p className="text-red-500 font-semibold">Login to borrow</p>
)}

      <div className="mt-6">
<h3 className="text-lg font-semibold">
  Rating⭐: {averageRating !== null ? `${averageRating}/5` : 'No rating yet'}
</h3>

<div className="flex gap-2 mt-2">
  {[1, 2, 3, 4, 5].map(num => (
    <button
      key={num}
      onClick={() => handleRating(num)}
      className={`px-2 py-1 rounded ${
        num === userRating
          ? 'bg-yellow-600 text-white'
          : 'bg-yellow-400 hover:bg-yellow-500 text-black'
      }`}
    >
      {num}
    </button>
  ))}
</div>

{userRating !== 0 && (
  <p className="text-sm text-gray-600 mt-1">Your rate: {userRating}</p>
)}

<div className="mt-6">
  <h3 className="text-lg font-semibold">💬 Comments</h3>
  {comments.length === 0 ? (
    <p className="text-gray-500"><strong>No comments yet</strong></p>
  ) : (
    <div className="space-y-3 mt-2">
      {comments.map((c, i) => (
        <div key={i} className="bg-gray-100 p-2 rounded shadow">
          <p className="font-bold"><strong>{c.name}</strong>:</p>
          <p>{c.text}</p>
        </div>
      ))}
    </div>
  )}

  <textarea
    value={commentText}
    onChange={e => setCommentText(e.target.value)}
    className="w-full mt-4 p-2 border rounded"
    placeholder="Write your comment..."
  />
  <button
    onClick={handleAddComment}
    className="mt-2 bg-blue-500 text-white px-4 py-1 rounded"
  >
    Post Comment
  </button>
</div>

      
      
</div>
</div>
  );
}

export default BookPage;
