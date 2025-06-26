// src/App.jsx
import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './Layout/Layout';
import HomePage from './pages/HomePage';
import BookPage from './pages/BookPage';
import MyBooksPage from './pages/MyBooksPage';
import MyWishlistPage from './pages/MyWishlistPage';
import NotificationsPage from './pages/NotificationsPage';
import UserProfilePage from './pages/UserProfilePage';
import MyNotifyListPage from './pages/MyNotifyListPage';
import SearchPage from './pages/SearchPage';
import LoginCard from './components/LoginCard';
import RegisterCard from './components/RegisterCard';
import ManageBooksPage from './pages/ManageBooksPage';
import ManageUsersPage from './pages/ManageUsersPage';
function App() {
  const [user, setUser] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [theme, setTheme] = useState('light');


  useEffect(() => {
    const saved = sessionStorage.getItem("loggedInUser");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("theme") || "light";
    document.body.classList.remove("light", "dark");
    document.body.classList.add(saved);
    setTheme(saved);
  }, []);


  const handleLogout = () => {
    sessionStorage.removeItem("loggedInUser");
    setUser(null);
  };

  return (
    <>

      <Layout
        user={user}
        onLogout={handleLogout}
        onLoginClick={() => setShowLogin(true)}
        theme={theme}
        setTheme={setTheme}
      >
        {/* Login Card */}
        {showLogin && (
          <LoginCard
            onClose={() => setShowLogin(false)}
            onLoginSuccess={(newUser) => {
              setUser(newUser);
              setShowLogin(false);
            }}
            onSwitchToRegister={() => {
              setShowLogin(false);
              setShowRegister(true);
            }}
          />
        )}

        {/* Register Card */}
        {showRegister && (
          <RegisterCard
            onClose={() => setShowRegister(false)}
            onRegisterSuccess={(newUser) => {
              setUser(newUser);
              setShowRegister(false);
            }}
            onSwitchToLogin={() => {
              setShowRegister(false);
              setShowLogin(true);
            }}
          />
        )}
        <Routes>
          
          <Route path="/" element={<HomePage user={user} onSelectBook={setSelectedBook} />} />
          <Route path="/book" element={<BookPage user={user} selectedBook={selectedBook} />} />
          <Route path="/book/:id" element={<BookPage user={user} />} />
          <Route path="/mybooks" element={<MyBooksPage user={user} />} />
          <Route path="/wishlist" element={<MyWishlistPage user={user} />} />
          <Route path="/notifications" element={<NotificationsPage user={user} />} />
          <Route path="/profile" element={<UserProfilePage user={user} />} />
          <Route path="/notifylist" element={<MyNotifyListPage user={user} />} />
          <Route path="/search" element={<SearchPage user={user} onSelectBook={setSelectedBook} />} />
          <Route path="/manage-books" element={<ManageBooksPage />} />
          <Route path="/manage-users" element={<ManageUsersPage />} />

        </Routes>
      </Layout>


    </>
  );
}

export default App;
