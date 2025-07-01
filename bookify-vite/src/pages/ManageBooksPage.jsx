import React, { useEffect, useState } from 'react';
import { get, ref } from 'firebase/database';
import { db } from '../firebase';
import SearchBar from '../components/SearchBar';
import AdminBookCard from '../components/AdminBookCard';

function ManageBooksPage() {
  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    // Load books data from Firebase and update state
    const load = async () => {
      const snap = await get(ref(db, 'books'));
      const list = Object.values(snap.val() || {});
      setBooks(list);
    };
    load();
  }, []);

  // Update a single book in the books state after saving changes
  const handleBookUpdate = (updatedBook) => {
    setBooks(prev =>
      prev.map(b =>
        b.book_id === updatedBook.book_id ? updatedBook : b
      )
    );
  };

  // Filter books based on search query (by name or author)
  const filtered = books.filter(b =>
    b.name?.toLowerCase().includes(query.toLowerCase()) ||
    b.author?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="pt-14 p-6 max-w-3xl mx-auto text-copy-primary">
      <div className="flex justify-between items-baseline mb-4">
        <h2 className="text-2xl font-bold">Manage Books</h2>
        <SearchBar value={query} onSearch={setQuery} />
      </div>
      <div className="grid gap-3">
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
