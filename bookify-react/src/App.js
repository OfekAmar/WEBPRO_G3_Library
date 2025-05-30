import React, { useState, useEffect } from 'react';
import HomePage from './HomePage';
import BookPage from './BookPage';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import SearchPage from './SearchPage';
import MyBooksPage from './MyBooksPage';
import UserProfilePage from './UserProfilePage';


function App() {
  const [selectedBook, setSelectedBook] = useState(null);
  const [page, setPage] = useState('home'); // 'home' | 'login' | 'register'
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("selectedBook");
    if (stored) setSelectedBook(JSON.parse(stored));

    const saved = localStorage.getItem("loggedInUser");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    setUser(null);
  };
  

  const renderHeader = () => (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-blue-600 cursor-pointer" onClick={() => {
        setSelectedBook(null);
        setPage('home');
      }}>
        📚 Bookify
      </h1>
      <div className="flex items-center gap-4">
        {user ? (
  <>
    <button onClick={() => setPage('search')} className="bg-gray-300 text-black px-3 py-2 rounded">Search</button>
    <button onClick={() => setPage('mybooks')} className="bg-yellow-400 text-black px-3 py-2 rounded">My Books</button>
    <button className="bg-red-500 text-white px-3 py-2 rounded" onClick={handleLogout}>Logout</button>
  </>
) : (
  <>
    <button className="bg-blue-500 text-white px-3 py-2 rounded" onClick={() => setPage('login')}>Login</button>
    <button className="bg-green-500 text-white px-3 py-2 rounded" onClick={() => setPage('register')}>Register</button>
    <button onClick={() => setPage('search')} className="bg-gray-300 text-black px-3 py-2 rounded">Search</button>
    <button onClick={() => setPage('profile')} className="bg-purple-500 text-white px-3 py-2 rounded">Profile</button>
  </>
)}
      </div>
    </header>
  );

  return (
  <div>
    {renderHeader()}

    <main className="p-4">
  {page === 'login' ? (
    <LoginPage onLogin={(u) => {
      setUser(u);
      setPage('home');
    }} />
  ) : page === 'register' ? (
    <RegisterPage onRegister={(u) => {
      setUser(u);
      setPage('home');
    }} />
  ) : page === 'search' ? (
    <SearchPage onSelectBook={(book) => {
      setSelectedBook(book);
      setPage('home');
    }} />
  ) : page === 'mybooks' ? (
  <MyBooksPage />
) : page === 'profile' ? (
  <UserProfilePage />
  ) : selectedBook ? (
    <>
      <button onClick={() => {
        sessionStorage.removeItem("selectedBook");
        setSelectedBook(null);
      }} className="mb-4 bg-gray-200 px-3 py-1 rounded">← Back</button>
      <BookPage />
    </>
  ) : (
    <HomePage onSelectBook={setSelectedBook} />
  )}
</main>

  </div>
);
}

export default App;
