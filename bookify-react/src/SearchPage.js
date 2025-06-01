import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { ref, get, update } from 'firebase/database';



function SearchPage({ onSelectBook }) {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [selectedBookId, setSelectedBookId] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      const snapshot = await get(ref(db, 'books'));
      const data = snapshot.val();
      const bookList = Object.entries(data || {})
        .filter(([_, book]) => book !== null)
        .map(([_, book]) => ({
            ...book,
            id: book.book_id // ✅ use internal ID for consistency
        }));
      setBooks(bookList);
      const subjects = [...new Set(bookList.map(book => book.subject).filter(Boolean))];
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
      <h2 className="text-xl font-bold mb-4">Search Books🔎</h2>
      <input
        type="text"
        placeholder="Search by book's name, or author"
        value={search}
        onChange={e => {
          setSearch(e.target.value);
          setHasSearched(true); // מופעל כשיש חיפוש
        }}
        className="w-full p-2 mb-4 border rounded"
      />
      <label className="block mb-2 font-medium">Filter by subject:</label>
      <select
        value={selectedSubject}
        onChange={e => {
          setSelectedSubject(e.target.value);
          setHasSearched(true);
        }}
        className="w-full p-2 mb-4 border rounded"
      >
        <option value="">-- All Subjects --</option>
        {subjects.map((subject, idx) => (
          <option key={idx} value={subject}>
            {subject}
          </option>
        ))}
      </select>

      {hasSearched && filtered.length > 0 && (
   <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
    {filtered.map(book => (
      <div
        key={book.id}
        className="cursor-pointer border p-2 rounded shadow hover:shadow-md"
      >
        <img
          src={book.photo}
          alt={book.name}
          className="w-full h-48 object-cover rounded"
          onClick={() => {
            setSelectedBookId(book.id);
            sessionStorage.setItem("selectedBook", JSON.stringify(book));
            onSelectBook(book);
          }}
                  />
        <p className="mt-2 text-sm font-semibold">{book.name}</p>
        <p className="text-xs text-gray-600">{book.author} ({book.year})</p>
        <p className="text-xs text-gray-500"> Location📍: {book.location}</p>
        {book.available_copies === 0 && (
          <button
            className="mt-2 bg-pink-500 text-white px-3 py-1 rounded text-xs"
            onClick={async () => {
              const storedUser = localStorage.getItem("loggedInUser");
              if (!storedUser) return alert("Please log in to add to notify list.");

              const user = JSON.parse(storedUser);
              const userIndex = user.userIndex;

              const userRef = ref(db, `users/${userIndex}/notify_list`);
              const snap = await get(userRef);
              const current = snap.val() || [];

              if (current.includes(book.book_id)) {
                alert("Already in your notify list.");
                return;
              }

              const updatedList = [...current, book.book_id];

              await update(ref(db, `users/${userIndex}`), {
                notify_list: updatedList
              });

              alert("Book added to notify list!");
            }}
          >
             Add to Notify List🔔 
          </button>
        )}
      </div>
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