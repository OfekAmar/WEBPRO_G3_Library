import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { ref, get } from 'firebase/database';

function HomePage({ onSelectBook }) {
  const [books, setBooks] = useState({ trending: [], new: [] });
  const [user, setUser] = useState(null);

 useEffect(() => {
  const fetchBooks = async () => {
    const snapshot = await get(ref(db, 'books'));
    const data = snapshot.val();
    const allBooks = Object.entries(data || {})
      .filter(([_, book]) => book !== null)
      .map(([_, book]) => ({
        ...book,
        id: book.book_id
      }));

    const ratedBooks = allBooks
      .filter(book => typeof book.rate === 'number')
      .sort((a, b) => b.rate - a.rate)
      .slice(0, 5);

    const ratedIds = new Set(ratedBooks.map(b => b.book_id));
    const newBooks = allBooks.filter(b => !ratedIds.has(b.book_id));

    setBooks({ trending: ratedBooks, new: newBooks });
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
        
        
      </header>

      <main className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Welcome to Bookify📖</h2>
        {renderSection("Trending🔥", books.trending)}
        {renderSection("Newly Added🆕 ", books.new)}
      </main>
    </div>
  );
}

export default HomePage;
