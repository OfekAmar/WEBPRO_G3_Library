// src/pages/HomePage.jsx
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { ref, get } from 'firebase/database';
import BookCard from '../components/BookCard';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const [books, setBooks] = useState({ trending: [], new: [] });
  const [user, setUser] = useState(null);
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      const snapshot = await get(ref(db, 'books'));
      const data = snapshot.val();
      const allBooks = Object.entries(data || {})
        .filter(([_, book]) => book !== null)
        .map(([_, book]) => ({
          ...book,
          id: book.book_id,
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

  const handleSearch = () => {
    if (searchText.trim()) {
      sessionStorage.setItem('searchQuery', searchText);
      navigate('/search');
    }
  };

  const renderSection = (title, bookSlice) => (
    <section className="mt-8">
      <h2 className="text-lg font-bold mb-2">{title}</h2>
      <div className="grid gap-4 px-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',maxWidth: '70%', }}>

        {bookSlice.map(book => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </section>
  );

  return (
    <div>
      <div className="flex flex-row items-center gap-2 max-w-2xl w-full">
      <input
        type="text"
        placeholder="Search by book's name or author..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="flex-1 border p-2 rounded"
      />
      <button
        onClick={handleSearch}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Search
      </button>
    </div>

      <h2 className="text-3xl font-semibold mb-4">Welcome to Bookify 📖</h2>
      {renderSection("Trending 🔥", books.trending)}
      {renderSection("Newly Added 🆕", books.new)}
    </div>
  );
}

export default HomePage;
