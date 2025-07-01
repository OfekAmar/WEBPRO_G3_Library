import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { ref, get } from 'firebase/database';
import BookCard from '../components/BookCard';
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const SearchPage = ({ user, onSelectBook }) => {
  const [searchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchBy, setSearchBy] = useState('free'); // 'title' | 'author' | 'free'
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all books from Firebase and set up search parameters
    const fetchBooks = async () => {
      const query = searchParams.get("q")?.toLowerCase() || "";
      const mode = searchParams.get("by") || "free";
      setSearch(query);
      setSearchBy(mode);
      setHasSearched(true);

      const snapshot = await get(ref(db, 'books'));
      const data = snapshot.val();

      const bookList = Object.entries(data || {})
        .filter(([_, book]) => book !== null)
        .map(([_, book]) => ({ ...book, id: book.book_id }));

      setBooks(bookList);
    };

    fetchBooks();
  }, [searchParams]);

  useEffect(() => {
    // Filter books based on search query and mode (title, author, free)
    const filtered = books.filter((book) => {
      const s = search.toLowerCase();
      if (!s) return true;
      if (searchBy === 'title') return book.name?.toLowerCase().includes(s);
      if (searchBy === 'author') return book.author?.toLowerCase().includes(s);
      return (
        book.name?.toLowerCase().includes(s) ||
        book.author?.toLowerCase().includes(s) ||
        book.description?.toLowerCase().includes(s) ||
        book.subject?.toLowerCase().includes(s)
      );
    });
    setFilteredBooks(filtered);
  }, [search, searchBy, books]);

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">
          Search Results for : <span className="text-black">"{search}"</span>
        </h2>

        {hasSearched && (
          filteredBooks.length > 0 ? (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filteredBooks.map(book => (
                <BookCard
                  key={book.id}
                  book={book}
                  onClick={() => navigate(`/book/${book.book_id}`)}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No books found.</p>
          )
        )}


      </div>
    </>
  );
};

export default SearchPage;
