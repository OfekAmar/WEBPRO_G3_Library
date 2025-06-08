import React, { useEffect, useState, useRef } from 'react';
import { db } from '../firebase';
import { ref, get, set, update } from 'firebase/database';
import Layout from '../Layout/Layout';
import Button from '../components/Button';
import BookCard from '../components/BookCard';
import { checkDueNotifications } from '../utils/notifications';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Footer from '../components/Footer';

function MyBooksPage({ user }) {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [returnedBooks, setReturnedBooks] = useState([]);
  const borrowedRef = useRef();
  const returnedRef = useRef();

  useEffect(() => {
    if (!user) return;
    fetchBorrows(user);
    checkDueNotifications(user);
  }, [user]);

  const fetchBorrows = async (parsedUser) => {
    const borrowsSnapshot = await get(ref(db, 'borrows'));
    const borrows = borrowsSnapshot.val() || [];
    const booksSnapshot = await get(ref(db, 'books'));
    const books = booksSnapshot.val() || [];

    const userId = parsedUser.user_id;
    const active = [];
    const history = [];

    for (const key in borrows) {
      const b = borrows[key];
      if (!b || typeof b.user_id === 'undefined') continue;

      if (b.user_id === userId) {
        const book = books[b.book_id];
        if (!book) continue;

        const entry = {
          ...book,
          id: book.book_id,
          ret_date: b.ret_date,
          status: b.status,
          borrow_id: key,
        };


        if (b.status === 'borrowed') active.push(entry);
        else history.push(entry);
      }
    }

    setBorrowedBooks(active);
    setReturnedBooks(history);
  };

  const returnBook = async (borrow) => {
    await update(ref(db, `borrows/${borrow.id}`), { status: 'returned' });

    const bookRef = ref(db, `books/${borrow.book_id}`);
    const bookSnapshot = await get(bookRef);
    const bookData = bookSnapshot.val();
    await update(bookRef, {
      available_copies: bookData.available_copies + 1
    });

    const today = new Date();
    const dueDate = new Date(borrow.ret_date);
    const isLate = today > dueDate;
    const lateDays = Math.ceil((today - dueDate) / (1000 * 60 * 60 * 24));

    if (isLate) {
      alert(`Returned "${borrow.name}". ⚠️ You are ${lateDays} day(s) late.`);
    } else {
      alert(`Returned "${borrow.name}" on time. Thank you!`);
    }

    const usersSnap = await get(ref(db, 'users'));
    const allUsers = usersSnap.val() || [];
    const bookName = bookData.name || 'a book';
    const now = new Date().toISOString();
    const notifSnap = await get(ref(db, 'managment/noti_index'));
    let notiId = notifSnap.val() + 1;

    for (let i = 1; i < allUsers.length; i++) {
      const u = allUsers[i];
      if (!u || !u.notify_list) continue;

      if (u.notify_list.includes(borrow.book_id)) {
        await set(ref(db, `notifications/${notiId}`), {
          noti_id: notiId,
          user_index: i,
          user_id: u.user_id,
          type: "System",
          content: `Good news! '${bookName}' from your notify list is now available.`,
          time: now
        });
        notiId++;
      }
    }

    await update(ref(db, 'managment'), { noti_index: notiId - 1 });

    setBorrowedBooks(prev => prev.filter(b => b.id !== borrow.id));
    setReturnedBooks(prev => [...prev, { ...borrow, status: 'returned' }]);
  };

  const scrollCarousel = (ref, direction = 'left') => {
    if (ref.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const renderCarousel = (title, booksArray, refName, showReturn = false) => (
    <div className="relative mb-12">
      <h3 className="text-2xl font-bold mb-4 text-center">{title}</h3>

      <div className="relative mx-auto" style={{ maxWidth: '1000px' }}>
        <Button
          variant="carousel"
          onClick={() => scrollCarousel(refName, 'left')}
          className="absolute -left-6 top-1/2 -translate-y-1/2 z-10"
        >
          <ChevronLeft size={24} />
        </Button>

        <div
          ref={refName}
          className="overflow-x-auto flex gap-4 pb-4 scroll-smooth px-6"
          style={{ scrollbarWidth: 'none' }}
        >
          {booksArray.map((book, i) => (
            <div key={i} className="relative group">
              <BookCard
                book={book}
                onClick={() => {
                  if (!showReturn) {
                    sessionStorage.setItem("selectedBook", JSON.stringify(book));
                    window.location.href = "/book";
                  }
                }}
              />

              {!returnedBooks.includes(book) && showReturn && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg backdrop-blur-sm">
                  <Button
                    label="Return"
                    variant="return"
                    onClick={() => returnBook(book)}
                    className="text-sm"
                  />
                </div>
              )}
            </div>

          ))}
        </div>

        <Button
          variant="carousel"
          onClick={() => scrollCarousel(refName, 'right')}
          className="absolute -right-6 top-1/2 -translate-y-1/2 z-10"
        >
          <ChevronRight size={24} />
        </Button>
      </div>
    </div>
  );

  if (!user) {
    return <p className="text-red-500 p-4">You must be logged in to view your borrowed books.</p>;
  }

  return (
    <>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6 text-center"></h2>
        {borrowedBooks.length === 0 ? (
          <div className="mb-20">
            <p className="text-gray-600 text-center">You haven’t borrowed any books yet. Maybe it's a good time to start reading :)</p>
          </div>
        ) : (
          renderCarousel('Borrowed Books', borrowedBooks, borrowedRef, true)
        )}

        <h3 className="text-xl font-semibold mb-6 text-center"></h3>
        {returnedBooks.length === 0 ? (
          <div className="mb-20">
            <p className="text-gray-600 text-center">No books returned yet.</p>
          </div>
        ) : (
          renderCarousel('Returned Books History', returnedBooks, returnedRef)
        )}
      </div>
      <Footer />
    </>
  );
}

export default MyBooksPage;
