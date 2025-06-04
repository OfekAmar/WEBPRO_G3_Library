import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { ref, get, set, update } from 'firebase/database';
import Layout from '../Layout/Layout';
import Button from '../components/Button';
import BorrowedBookCard from '../components/BorrowedBookCard';
import { checkDueNotifications } from '../utils/notifications';

function MyBooksPage({ user }) {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [returnedBooks, setReturnedBooks] = useState([]);

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
          id: key,
          bookName: book.name,
          photo: book.photo,
          ret_date: b.ret_date,
          status: b.status,
          book_id: b.book_id
        };

        if (b.status === 'borrow') active.push(entry);
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
      alert(`✅ Returned "${borrow.bookName}". ⚠️ You are ${lateDays} day(s) late.`);
    } else {
      alert(`✅ Returned "${borrow.bookName}" on time. Thank you!`);
    }

    // Send notifications
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

  if (!user) {
    return <p className="text-red-500 p-4">You must be logged in to view your borrowed books.</p>;
  }

  return (

      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">My Borrowed Books 📚</h2>

        {borrowedBooks.length === 0 ? (
          <p className="text-gray-600">You haven’t borrowed any books yet.</p>
        ) : (
          <div className="flex overflow-x-auto space-x-4 mb-10 pb-2 whitespace-nowrap">
            {borrowedBooks.map((book, i) => (
              <BorrowedBookCard key={i} book={book} onReturn={() => returnBook(book)} />
            ))}
          </div>
        )}

        <h3 className="text-xl font-semibold mb-4">History of Returned Books 📖</h3>

        {returnedBooks.length === 0 ? (
          <p className="text-gray-600">No books returned yet.</p>
        ) : (
          <div className="flex overflow-x-auto space-x-4 mb-10 pb-2 whitespace-nowrap">
            {returnedBooks.map((book, i) => (
              <BorrowedBookCard key={i} book={book} returned />
            ))}
          </div>
        )}
      </div>

  );
}

export default MyBooksPage;
