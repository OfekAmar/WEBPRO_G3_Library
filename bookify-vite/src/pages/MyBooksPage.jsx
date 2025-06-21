import React, { useEffect, useState, useRef } from 'react';
import { db } from '../firebase';
import { ref, get, set, update } from 'firebase/database';
import Layout from '../Layout/Layout';
import Button from '../components/Button';
import BookCard from '../components/BookCard';
import { checkDueNotifications } from '../utils/notifications';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import BorrowedBookCard from '../components/BorrowedBookCard';
import SuccessfulMessage from '../components/SuccessfulMessage';
import LateReturnMessage from '../components/LateReturnMessage';


function MyBooksPage({ user }) {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [returnedBooks, setReturnedBooks] = useState([]);
  const [message, setMessage] = useState('');
  const [pendingReturnBook, setPendingReturnBook] = useState(null);
  const [isLateMessage, setIsLateMessage] = useState(false);



  const borrowedRef = useRef();
  const returnedRef = useRef();
  const navigate = useNavigate();

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

    const returnedBookIds = new Set();

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

        if (b.status === 'borrowed') {
          active.push(entry);
        } else if (!returnedBookIds.has(b.book_id)) {
          returnedBookIds.add(b.book_id);
          history.push(entry);
        }
      }
    }


    setBorrowedBooks(active);
    setReturnedBooks(history);
  };

  const returnBook = async (book) => {
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
      setMessage(`Returned "${bookData.name}".\nYou are ${lateDays} day(s) late.`);
      setIsLateMessage(true);
    } else {
      setMessage(`Returned "${bookData.name}" on time.\nThank you!`);
      setIsLateMessage(false);
    }
    setPendingReturnBook({ ...book, status: 'returned' });




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

    // update UI
    //setBorrowedBooks(prev => prev.filter(b => b.book_id !== book.book_id));
    //setReturnedBooks(prev => [...prev, { ...book, status: 'returned' }]);
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
            showReturn ? (
              <BorrowedBookCard key={i} book={book} onReturn={returnBook} />
            ) : (
              <BookCard key={i} book={book} onClick={() => navigate(`/book/${book.book_id}`)} />
            )
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
      {message && pendingReturnBook && (
        isLateMessage ? (
          <LateReturnMessage
            message={message}
            onConfirm={() => {
              setMessage('');
              setBorrowedBooks(prev =>
                prev.filter(b => b.book_id !== pendingReturnBook.book_id)
              );
              setReturnedBooks(prev => [...prev, pendingReturnBook]);
              setPendingReturnBook(null);
              setIsLateMessage(false);
            }}
          />
        ) : (
          <SuccessfulMessage
            message={message}
            onConfirm={() => {
              setMessage('');
              setBorrowedBooks(prev =>
                prev.filter(b => b.book_id !== pendingReturnBook.book_id)
              );
              setReturnedBooks(prev => [...prev, pendingReturnBook]);
              setPendingReturnBook(null);
            }}
          />
        )
      )}


      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6 text-center"></h2>
        {borrowedBooks.length === 0 ? (
          <div className="mb-20">
            <p className="text-gray-600 text-center">You haven’t borrowed any books yet. Maybe it's a good time to start reading</p>
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
