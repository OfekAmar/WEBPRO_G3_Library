import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { ref, get } from 'firebase/database';

function HomePage({ onSelectBook }) {
  const [books, setBooks] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      const snapshot = await get(ref(db, 'books'));
      const data = snapshot.val();
      const bookList = Object.entries(data || {}).map(([id, book]) => ({
        ...book,
        id: parseInt(id)
      }));
      setBooks(bookList);
    };

    fetchBooks();
    const saved = localStorage.getItem("loggedInUser");
    if (saved) {
      setUser(JSON.parse(saved));
    }
  }, []);

  const renderSection = (title, bookSlice) => (
    <section className="mt-8">
      <h2 className="text-lg font-bold mb-2">{title}</h2>
      <div className="flex overflow-x-auto space-x-4 pb-2">
        {bookSlice.map(book => (
          <img
            key={book.id}
            src={book.photo || book.coverUrl}
            alt={book.name}
            className="w-40 h-60 object-cover rounded shadow cursor-pointer"
            onClick={() => {
              sessionStorage.setItem("selectedBook", JSON.stringify(book));
              onSelectBook(book);
            }}
          />
        ))}
      </div>
    </section>
  );

  return (
    <div className="p-4">
      <header className="bg-white shadow p-4 flex justify-between items-center relative">
        <h1 className="text-2xl font-bold text-blue-600 mr-auto">📚 Bookify</h1>
        <div className="flex items-center gap-4 relative">
          {user ? (
            <button className="bg-red-500 text-white px-3 py-2 rounded" onClick={() => {
              localStorage.removeItem("loggedInUser");
              setUser(null);
            }}>🚪 Logout</button>
          ) : (
            <>
              <button className="bg-blue-500 text-white px-3 py-2 rounded">Login</button>
              <button className="bg-green-500 text-white px-3 py-2 rounded">Register</button>
            </>
          )}
        </div>
      </header>

      <main className="mt-6">
        <h2 className="text-xl font-semibold mb-4">📖 Welcome to Bookify</h2>
        {renderSection("🔥 Trending", books.slice(12, 23))}
        {renderSection("🆕 Newly Added", books.slice(0, 10))}
        {renderSection("📥 Recently Returned", books.slice(16, 23))}
      </main>
    </div>
  );
}

export default HomePage;
