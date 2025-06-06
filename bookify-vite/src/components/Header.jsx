import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Search, Menu } from 'lucide-react';


const Header = ({ user, onLogout, onLoginClick }) => {
  const [search, setSearch] = React.useState('');
  const [subject, setSubject] = React.useState('');
  const navigate = useNavigate();
  const [searchType, setSearchType] = useState("free");
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (search.trim()) query.set("q", search.trim());
    if (searchType) query.set("by", searchType);
    navigate(`/search?${query.toString()}`);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full z-[9999] bg-white shadow-md px-8 py-4 flex items-center justify-between">

      {/* Logo */}
      <Link to="/" className="flex items-center">
        <img src="logos\bookify_logo_bi.png" alt="Bookify logo" className="h-9" />
      </Link>

      {/* Search + Category filter */}
      <form
        onSubmit={handleSearch}
        className="w-full max-w-[clamp(240px,60%,640px)]"

      >
        <div className="flex flex-col sm:flex-row items-stretch bg-white border border-gray-300 rounded-full overflow-hidden shadow-sm">
          {/* Category */}
          <div className="flex items-center border-b sm:border-b-0 sm:border-r border-gray-300 px-4 py-2">
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="text-sm text-gray-700 bg-white focus:outline-none"
            >
              <option value="free">Free Text</option>
              <option value="title">Title</option>
              <option value="author">Author</option>
            </select>
          </div>

          {/* Search Input + Button */}
          <div className="flex flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="flex-1 px-4 py-2 text-sm focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2 text-blue-900"
            >
              <Search size={18} />
            </button>
          </div>
        </div>
      </form>



      {/* Right actions */}
      <div className="flex items-center gap-4 relative">

        {user && (
          <Link to="/notifications" className="text-gray-600 hover:text-blue-500 transition">
            <Bell size={20} />
          </Link>
        )}

        {user && (
          <>
            <button onClick={() => setShowMenu(!showMenu)} className="text-gray-700">
              <Menu size={24} />
            </button>

            {showMenu && (
              <div
                ref={menuRef}
                className="absolute right-10 top-full mt-2 bg-white shadow-xl rounded-lg p-4 w-60 z-50"
              >
                <Link to="/profile" className="block py-2 hover:text-blue-500">👤 Profile</Link>
                <Link to="/myBooks" className="block py-2 hover:text-blue-500">📚 My Books</Link>
                <Link to="/wishlist" className="block py-2 hover:text-blue-500">💖 Wishlist</Link>
                <Link to="/notifylist" className="block py-2 hover:text-blue-500">🔔 Notify</Link>
              </div>
            )}
          </>
        )}

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
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md transition"
          >
            Login / Register
          </button>
        )}
      </div>
    </header >
  );
};

export default Header;
