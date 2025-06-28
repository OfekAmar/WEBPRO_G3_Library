import React, { useEffect, useState } from 'react';
import { get, ref } from 'firebase/database';
import { db } from '../firebase';
import SearchBar from '../components/SearchBar';
import AdminBookCard from '../components/AdminBookCard';

function ManageBooksPage() {
  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const load = async () => {
      const snap = await get(ref(db, 'books'));
      const list = Object.values(snap.val() || {});
      setBooks(list);
    };
    load();
  }, []);

  const handleBookUpdate = (updatedBook) => {
    setBooks(prev =>
      prev.map(b =>
        b.book_id === updatedBook.book_id ? updatedBook : b
      )
    );
  };

  const filtered = books.filter(b =>
    b.name?.toLowerCase().includes(query.toLowerCase()) ||
    b.author?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="p-6 max-w-4xl mx-auto text-copy-primary">
      <h2 className="text-2xl font-bold mb-4">📚 Manage Books</h2>
      <SearchBar value={query} onSearch={setQuery} />
      <div className="grid gap-4">
        {filtered.map((book, i) => (
          <AdminBookCard
            key={i}
            book={book}
            onSave={handleBookUpdate}
          />
        ))}
      </div>
    </div>
  );
}

export default ManageBooksPage;
