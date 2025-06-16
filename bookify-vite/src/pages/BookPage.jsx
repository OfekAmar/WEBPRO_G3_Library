import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { ref, set, get, update } from 'firebase/database';
import Layout from '../Layout/Layout';
import Rating from '../components/Rating';
import CommentSection from '../components/CommentSection';
import BorrowButton from '../components/BorrowButton';
import WishlistButton from '../components/WishlistButton';
import Button from '../components/Button';
import NotifyButton from '../components/NotificationBell';
import { resolveBookCover } from '../utils/fetchGoogleBookCover';
import { useParams } from "react-router-dom";

function BookPage({ user }) {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [cover, setCover] = useState(null);
  const [message, setMessage] = useState("");
  const [inNotifyList, setInNotifyList] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [averageRating, setAverageRating] = useState(null);
  const [comments, setComments] = useState([]);
  const [inWishlist, setInWishlist] = useState(false);
  const [alreadyBorrowed, setAlreadyBorrowed] = useState(false);
  const [showReviews, setShowReviews] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      const snap = await get(ref(db, `books/${id}`));
      const bookData = snap.val();
      if (bookData) {
        setBook(bookData);
        const image = await resolveBookCover(bookData);
        setCover(image);
      }
    };
    if (id) fetchBook();
  }, [id]);

  useEffect(() => {
    const loadCover = async () => {
      if (book) {
        const image = await resolveBookCover(book);
        setCover(image);
      }
    };
    loadCover();
  }, [book]);

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
          String(b.book_id) === String(book.book_id) &&
          String(b.user_id) === String(user.user_id) &&
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
      setMessage("Error saving rating.");
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
      setMessage("Error saving comment.");
    }
  };

  const handleBorrow = async () => {
    if (!user || !book) return;

    const mgmtRef = ref(db, 'managment');
    const mgmtSnap = await get(mgmtRef);
    const currentIndex = mgmtSnap.val()?.borrows_index || 0;
    const newIndex = currentIndex + 1;

    const today = new Date();
    const returnDate = new Date();
    returnDate.setDate(today.getDate() + 14);

    const newBorrow = {
      borrow_id: newIndex,
      user_id: user.user_id,
      book_id: book.book_id,
      status: 'borrowed',
      b_date: today.toISOString().split('T')[0],
      ret_date: returnDate.toISOString().split('T')[0]
    };

    await set(ref(db, `borrows/${newIndex}`), newBorrow);

    const bookRef = ref(db, `books/${book.book_id}`);
    const bookSnap = await get(bookRef);
    const bookData = bookSnap.val();

    if (!bookData) {
      console.error("Book not found in DB");
      return;
    }

    const newAvailable = (bookData.available_copies || 1) - 1;
    await update(bookRef, { available_copies: newAvailable });

    await update(mgmtRef, { borrows_index: newIndex });

    setMessage(`Book borrowed successfully! Return by ${returnDate.toLocaleDateString()}`);
    setBook(prev => ({
      ...prev,
      available_copies: newAvailable
    }));
    setAlreadyBorrowed(true);
  };

  const handleReturn = async () => {
    if (!user || !book) return;

    const borrowsSnap = await get(ref(db, 'borrows'));
    const borrows = borrowsSnap.val() || {};

    const entry = Object.entries(borrows).find(
      ([, b]) =>
        String(b.book_id) === String(book.book_id) &&
        String(b.user_id) === String(user.user_id) &&
        b.status === 'borrowed'
    );

    if (!entry) return;

    const [borrowId, borrow] = entry;

    await update(ref(db, `borrows/${borrowId}`), { status: 'returned' });

    const bookRef = ref(db, `books/${book.book_id}`);
    const bookSnap = await get(bookRef);
    const bookData = bookSnap.val();

    if (!bookData) {
      console.error("Book not found in DB");
      return;
    }

    const updatedAvailable = (bookData.available_copies || 0) + 1;
    await update(bookRef, { available_copies: updatedAvailable });

    const today = new Date();
    const dueDate = new Date(borrow.ret_date);
    const isLate = today > dueDate;
    const lateDays = Math.ceil((today - dueDate) / (1000 * 60 * 60 * 24));

    if (isLate) {
      setMessage(`Returned "${bookData.name}". ⚠️ You are ${lateDays} day(s) late.`);
    } else {
      setMessage(`Returned "${bookData.name}" on time. Thank you!`);
    }

    const usersSnap = await get(ref(db, 'users'));
    const allUsers = usersSnap.val() || [];

    const notifSnap = await get(ref(db, 'managment/noti_index'));
    let notiId = notifSnap.val() + 1;
    const now = new Date().toISOString();

    for (let i = 1; i < allUsers.length; i++) {
      const u = allUsers[i];
      if (!u || !u.notify_list) continue;

      if (u.notify_list.includes(book.book_id)) {
        await set(ref(db, `notifications/${notiId}`), {
          noti_id: notiId,
          user_index: i,
          user_id: u.user_id,
          type: "System",
          content: `Good news! '${bookData.name}' from your notify list is now available.`,
          time: now
        });
        notiId++;
      }
    }

    await update(ref(db, 'managment'), { noti_index: notiId - 1 });

    setAlreadyBorrowed(false);
    setBook(prev => ({
      ...prev,
      available_copies: updatedAvailable
    }));
  };

  if (!book) return <p className="p-4 text-red-500">No book selected</p>;

  return (
    <div className="bg-background min-h-screen py-10 px-4 text-copy-primary">
      <div className="bg-[rgba(var(--bookcard),1)] max-w-6xl mx-auto bg-card rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

          <div className="flex justify-center">
            {cover ? (
              <img src={cover} alt={book.name} className="w-full max-w-xs rounded-lg shadow" />
            ) : (
              <div className="w-48 h-64 bg-border animate-pulse rounded-lg shadow" />
            )}
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-4">{book.name}</h2>
            {book.available_copies > 0 ? (
              <div className="flex items-center gap-2 mb-4">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                <span className="text-green-600 font-semibold">
                  {book.available_copies} more copie{book.available_copies > 1 ? 's' : ''} available to borrow
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 mb-4">
                <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                <span className="text-red-600 font-semibold">Out of Stock</span>
              </div>
            )}
            <Rating
              average={averageRating}
              userRating={userRating}
              reviewCount={comments.length}
              onRate={handleRating}
              onOpenReviews={() => {
                setShowReviews(prev => {
                  const newValue = !prev;
                  if (newValue) {
                    setTimeout(() => {
                      const el = document.getElementById('reviews-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }
                  return newValue;
                });
              }}
            />
            <p className="mb-2"><strong>Author:</strong> {book.author}</p>
            <p className="mb-4"><strong>Description:</strong> {book.description}</p>
            <p className="text-sm text-copy-secondary mb-4"><strong>Location: </strong>{book.location}</p>

            {user ? (
              <div className="space-y-3">

                <div className="flex items-center gap-4">
                  {book.available_copies > 0 ? (
                    alreadyBorrowed ? (
                      <Button variant='borrow' label="Return Book" onClick={handleReturn} className="border border-teal-700 text-teal-700 font-semibold px-6 py-2 rounded-full hover:bg-teal-50 dark:hover:bg-teal-800/20"/>
                    ) : (
                      <BorrowButton isBorrowed={false} onToggle={handleBorrow} />
                    )
                  ) : (
                    <NotifyButton
                      isInNotifyList={inNotifyList}
                      onToggle={toggleNotifyList}
                      className="text-red-500 hover:text-red-700 dark:hover:bg-red-800/20"
                    />
                  )}

                  <WishlistButton
                    isWished={inWishlist}
                    onToggle={toggleWishlist}
                  />
                </div>

                {message && <p className="mt-2 text-green-600">{message}</p>}
              </div>
            ) : (
              <p className="text-red-500 font-semibold mt-4">
                Login to borrow
              </p>
            )}
            {showReviews && (
              <CommentSection
                comments={comments}
                userName={user?.name || user?.username}
                onPostComment={handleAddComment}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookPage;
