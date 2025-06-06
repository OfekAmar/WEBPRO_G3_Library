import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Search } from 'lucide-react';

const Header = ({ user, onLogout, onLoginClick }) => {
  const [search, setSearch] = React.useState('');
  const [subject, setSubject] = React.useState('');
  const navigate = useNavigate();

  const subjects = [
    'Fiction', 'Science', 'Technology', 'History', 'Biography'
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (search.trim()) query.set("q", search.trim());
    if (subject) query.set("subject", subject);
    navigate(`/search?${query.toString()}`);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-[9999] bg-white shadow-md px-8 py-4 flex items-center justify-between">

      {/* Logo */}
      <Link to="/" className="flex items-center">
        <img src="logos\bookify_logo_bi.png" alt="Bookify logo" className="h-9" />
      </Link>

      {/* Search + Category filter */}
      <form
        onSubmit={handleSearch}
        className="absolute left-1/2 -translate-x-1/2 flex max-w-3xl w-full items-center gap-2"
      >
        {/* Subject select */}
        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="h-full px-3 py-2 border border-gray-300 rounded text-sm"
        >
          <option value="">All</option>
          {subjects.map((s, idx) => (
            <option key={idx} value={s}>{s}</option>
          ))}
        </select>

        {/* Search input */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search for books..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded md text-sm"
        />

        {/* Submit button */}
        <button
          type="submit"
          className="bg-[rgb(207,230,238)] border-gray-800 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          <Search size={18} className="text-indigo-950" />
        </button>
      </form>

      {/* Right actions */}
      <div className="flex items-center gap-4">
        {user && (
          <nav className="hidden md:flex gap-4 text-sm font-medium">
            <Link to="/profile" className="hover:text-blue-500">👤 Profile</Link>
            <Link to="/myBooks" className="hover:text-blue-500">📚 My Books</Link>
            <Link to="/wishlist" className="hover:text-blue-500">💖 Wishlist</Link>
            <Link to="/notifylist" className="hover:text-blue-500">🔔 Notify</Link>
          </nav>
        )}
        {user && (
          <Link to="/notifications" className="text-gray-600 hover:text-blue-500 transition">
            <Bell size={20} />
          </Link>)}

        {user ? (
          <button
            onClick={onLogout}
            className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white px-4 py-1.5 rounded-md shadow-md transition"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={onLoginClick}
            className="bg-[rgb(207,230,238)] border-gray-800 hover:bg-blue-700 text-indigo-950 px-4 py-1.5 rounded-md transition"
          >
            Login / Register
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
