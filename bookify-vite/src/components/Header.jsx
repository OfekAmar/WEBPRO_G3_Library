import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ user, onLogout, onLoginClick }) => {
  const tabClass =
    "px-3 py-1 rounded-md hover:bg-gray-700 transition-colors whitespace-nowrap";

  return (
    <header className="bg-gray-800 text-white px-4 py-3 flex justify-between items-center">
      {/* Left side: Logo + Tabs */}
      <div className="flex items-center gap-4 whitespace-nowrap">
        <Link to="/" className="text-3xl font-bold whitespace-nowrap border-white/30">
          BOOKIFY 📚
        </Link>
        <nav className="flex gap-2 items-center">
          {user && (
            <>
              <Link to="/profile" className="px-3 border-r border-white/30">👤 Profile</Link>
              <Link to="/myBooks" className="px-3 border-r border-white/30">📚 My Books</Link>
              <Link to="/wishlist" className="px-3 border-r border-white/30">💖 Wishlist</Link>
              <Link to="/notifylist" className="px-3 border-r border-white/30">🔔 Notify</Link>
              <Link to="/notifications" className="px-3">📩 Notifications</Link>
            </>
          )}
        </nav>
      </div>

      {/* Right side: Login/Logout */}
      <div className="ml-auto">
        {user ? (
          <button
            onClick={onLogout}
            className="px-3 py-1 rounded-md bg-red-600 hover:bg-red-700 transition"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={onLoginClick}
            className="px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-700 transition"
          >
            Login / Register
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
