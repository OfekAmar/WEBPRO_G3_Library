import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { ref, get, set, update } from 'firebase/database';
import { checkDueNotifications } from './utils/notifications'; // 👈 Make sure this path is correct

function MyBooksPage() {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [returnedBooks, setReturnedBooks] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    if (!storedUser) return;

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
    fetchBorrows(parsedUser);
    checkDueNotifications(parsedUser); // ✅ run notification check on mount
  }, []);

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

    // 🔔 Send notifications to wishers
    const usersSnap = await get(ref(db, 'users'));
    const allUsers = usersSnap.val() || [];

    const bookName = bookData.name || 'a book';
    const now = new Date().toISOString();

    const notifSnap = await get(ref(db, 'managment/noti_index'));
    let notiId = notifSnap.val() + 1;

    for (let i = 1; i < allUsers.length; i++) {
      const user = allUsers[i];
      if (!user || !user.wish_list) continue;

      if (user.wish_list.includes(borrow.book_id)) {
        await set(ref(db, `notifications/${notiId}`), {
          noti_id: notiId,
          user_index: i,
          user_id: user.user_id,
          type: "System",
          content: `Good news! '${bookName}' from your wishlist is now available.`,
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
      <h2 className="text-2xl font-bold mb-4">📚 My Borrowed Books</h2>

      {borrowedBooks.length === 0 ? (
        <p className="text-gray-600">You haven’t borrowed any books yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-10">
          {borrowedBooks.map((book, i) => (
            <div key={i} className="border p-2 rounded shadow">
              <img src={book.photo} alt={book.bookName} className="w-full h-48 object-cover rounded mb-2" />
              <p className="font-semibold">{book.bookName}</p>
              <p className="text-sm text-gray-600">Return by: {book.ret_date}</p>
              <button
                onClick={() => returnBook(book)}
                className="mt-2 bg-blue-500 text-white px-3 py-1 rounded"
              >
                Return Book
              </button>
            </div>
          ))}
        </div>
      )}

      <h3 className="text-xl font-semibold mb-4">📖 History of Returned Books</h3>
      {returnedBooks.length === 0 ? (
        <p className="text-gray-600">No books returned yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {returnedBooks.map((book, i) => (
            <div key={i} className="border p-2 rounded shadow bg-gray-100">
              <img src={book.photo} alt={book.bookName} className="w-full h-48 object-cover rounded mb-2" />
              <p className="font-semibold">{book.bookName}</p>
              <p className="text-sm text-gray-500">Returned</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyBooksPage;
