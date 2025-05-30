import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { ref, get } from 'firebase/database';

function SearchPage({ onSelectBook }) {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");

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
  }, []);

  const filtered = books.filter(book =>
    book.name?.toLowerCase().includes(search.toLowerCase()) ||
    book.author?.toLowerCase().includes(search.toLowerCase()) ||
    book.year?.toString().includes(search)
  );

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">🔎 Search Books</h2>
      <input
        type="text"
        placeholder="Search by name, author, or year"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {filtered.map(book => (
          <div
            key={book.id}
            className="cursor-pointer border p-2 rounded shadow hover:shadow-md"
            onClick={() => {
              sessionStorage.setItem("selectedBook", JSON.stringify(book));
              onSelectBook(book);
            }}
          >
            <img src={book.photo} alt={book.name} className="w-full h-48 object-cover rounded" />
            <p className="mt-2 text-sm font-semibold">{book.name}</p>
            <p className="text-xs text-gray-600">{book.author} ({book.year})</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchPage;