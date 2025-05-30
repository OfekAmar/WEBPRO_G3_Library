import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { ref, set, get, update } from 'firebase/database';

function BookPage() {
  const [book, setBook] = useState(null);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const stored = sessionStorage.getItem("selectedBook");
    const loggedIn = localStorage.getItem("loggedInUser");

    if (stored) setBook(JSON.parse(stored));
    if (loggedIn) setUser(JSON.parse(loggedIn));
  }, []);

  const borrowBook = async () => {
    if (!user || !book) return;

    const booksSnapshot = await get(ref(db, 'books'));
    const books = booksSnapshot.val();

    let bookId = null;
    for (let i = 1; i < books.length; i++) {
      if (books[i] && books[i].name === book.name) {
        bookId = i;
        break;
      }
    }

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
      if (users[i] && users[i].email === user.username) {
        userId = i;
        break;
      }
    }

    if (!userId) {
      setMessage("User ID not found");
      return;
    }

    // Check if user already borrowed this book and it's still active
    const borrowsSnapshot = await get(ref(db, 'borrows'));
    const allBorrows = borrowsSnapshot.val() || [];
    const alreadyBorrowed = allBorrows.some(
      b => b.book_id === bookId && b.user_id === userId && b.status === 'borrow'
    );

    if (alreadyBorrowed) {
      setMessage("You've already borrowed this book");
      return;
    }

    // Add borrow record
    const newBorrowId = allBorrows.length;
    const today = new Date();
    const returnDate = new Date(today);
    returnDate.setDate(today.getDate() + 10);

    const borrowEntry = {
      b_date: today.toISOString().split('T')[0],
      ret_date: returnDate.toISOString().split('T')[0],
      status: 'borrow',
      book_id: bookId,
      user_id: userId
    };

    await set(ref(db, `borrows/${newBorrowId}`), borrowEntry);

    // Decrease available copies
    await update(ref(db, `books/${bookId}`), {
      available_copies: available - 1
    });

    setMessage("Book borrowed successfully!");
  };

  if (!book) return <p className="p-4 text-red-500">No book selected</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">{book.name}</h2>
      <img src={book.photo} alt={book.name} className="w-52 h-72 mb-4 rounded shadow" />
      <p className="mb-2"><strong>Author:</strong> {book.author}</p>
      <p className="mb-2"><strong>Year:</strong> {book.year}</p>
      <p className="mb-4"><strong>Summary:</strong> {book.summary}</p>

      {user ? (
        <>
          <button onClick={borrowBook} className="bg-green-500 text-white px-4 py-2 rounded">
            Borrow This Book
          </button>
          {message && <p className="mt-4 text-green-600">{message}</p>}
        </>
      ) : (
        <p className="text-red-500 font-semibold">Login to borrow</p>
      )}
    </div>
  );
}

export default BookPage;
