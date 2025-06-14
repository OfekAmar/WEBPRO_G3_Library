import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Search, Menu, User, BookOpen, Heart, LogOut } from 'lucide-react';

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
    <header className="fixed top-0 left-0 w-full z-40 bg-white shadow-md px-8 py-4 flex items-center justify-between">

      {/* Logo */}
      <Link to="/" className="flex items-center">
        <img src="/images/bookify_logo_bi.png" alt="Bookify logo" className="h-9" />
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
          <>
            <Link to="/profile" className="text-indigo-950 hover:text-indigo-950 transition">
              <User size={20} className='text-indigo-950' />
            </Link>
            <Link to="/notifications" className="text-gray-600 hover:text-blue-500 transition">
              <Bell size={20} className='text-indigo-950' />
            </Link>
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="text-gray-700 bg-[rgb(207,230,238)] hover:bg-gray-200 p-2 rounded-full transition"
              >
                <Menu size={24} className='text-indigo-950' />
              </button>
              {showMenu && (
                <div
                  ref={menuRef}
                  className="absolute right-0 top-full mt-2 bg-white shadow-xl rounded-lg p-4 w-60 z-50"
                >
                  <div className="flex flex-col gap-1">
                    <Link to="/myBooks" className="flex items-center gap-2 py-2 hover:text-blue-900 w-full">
                      <BookOpen size={18} className='text-indigo-950' /> <span className="text-indigo-950 w-full">My Books</span>
                    </Link>
                    <Link to="/wishlist" className="flex items-center gap-2 py-2  hover:text-blue-900 w-full">
                      <Heart size={18} className='text-indigo-950' /> <span className="text-indigo-950 w-full">Wish List</span>
                    </Link>
                    <hr className="my-2 border-t border-gray-200" />
                    <button
                      onClick={() => {
                        onLogout();
                        navigate('/');
                      }}
                      className="flex items-center gap-2 py-2 text-red-600 hover:text-red-800 w-full"
                    >
                      <LogOut size={18} /> <span className="w-full text-start">Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {!user && (
          <button
            onClick={onLoginClick}
            className="bg-indigo-950 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md transition"
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
