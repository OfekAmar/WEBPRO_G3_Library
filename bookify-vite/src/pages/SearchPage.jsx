import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { ref, get, update } from 'firebase/database';
import Layout from '../Layout/Layout';
import SearchBar from '../components/SearchBar';
import SearchResultCard from '../components/SearchResultCard';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';

function SearchPage({ user }) {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const navigate = useNavigate();

useEffect(() => {
  const fetchBooks = async () => {
    const query = sessionStorage.getItem('searchQuery')?.toLowerCase() || "";
    setSearch(query); // ✅ this sets the input value
    setHasSearched(true); // ✅ triggers result rendering

    const snapshot = await get(ref(db, 'books'));
    const data = snapshot.val();

    const bookList = Object.entries(data || {})
      .filter(([_, book]) => book !== null)
      .map(([_, book]) => ({ ...book, id: book.book_id }));

    const subjects = [...new Set(bookList.map(book => book.subject).filter(Boolean))];
    setBooks(bookList);
    setSubjects(subjects);
  };

  fetchBooks();
}, []);

  const filtered = search.trim() || selectedSubject
    ? books.filter(book => {
        const matchesSearch = search.trim() === "" || (() => {
          const searchWords = search.toLowerCase().split(' ').filter(Boolean);
          const combinedWords = `${book.name} ${book.author}`.toLowerCase().split(' ');
          return searchWords.every(searchWord =>
            combinedWords.some(word => word.startsWith(searchWord))
          );
        })();
        const matchesSubject = selectedSubject === "" || book.subject === selectedSubject;
        return matchesSearch && matchesSubject;
      })
    : [];

  return (

      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Search Books 🔎</h2>

        <SearchBar
          value={search}
            onSearch={(value) => {
              setSearch(value);
              setHasSearched(true);
            }}
        />

        <label className="block mb-2 font-medium">Filter by subject:</label>
        <select
          value={selectedSubject}
          onChange={e => {
            setSelectedSubject(e.target.value);
            setHasSearched(true);
          }}
          className="p-2 mb-6 border rounded"
        >
          <option value="">-- All Subjects --</option>
          {subjects.map((subject, idx) => (
            <option key={idx} value={subject}>{subject}</option>
          ))}
        </select>

        {hasSearched && filtered.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filtered.map(book => (
              <SearchResultCard key={book.id} book={book} navigate={navigate} />
            ))}
          </div>
        )}

        {hasSearched && filtered.length === 0 && (
          <p className="text-gray-600">No matching books found.</p>
        )}
      </div>

  );
}

export default SearchPage;
