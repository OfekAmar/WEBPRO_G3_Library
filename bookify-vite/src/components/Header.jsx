import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Bell, Search, Menu, User, BookOpen, Heart, LogOut, Sun, Moon } from 'lucide-react';
import Button from '../components/Button';

const Header = ({ user, onLogout, onLoginClick }) => {
  const [search, setSearch] = React.useState('');
  const [subject, setSubject] = React.useState('');
  const navigate = useNavigate();
  const [searchType, setSearchType] = useState("free");
  const [showMenu, setShowMenu] = useState(false);
  const [theme, setTheme] = useState('light');
  const menuRef = useRef(null);
  const location = useLocation();


  const handleSearch = (e) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (search.trim()) query.set("q", search.trim());
    if (searchType) query.set("by", searchType);
    navigate(`/search?${query.toString()}`);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.body.classList.remove("light", "dark");
    document.body.classList.add(savedTheme);
    setTheme(savedTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    document.body.classList.remove("light", "dark");
    document.body.classList.add(nextTheme);
    localStorage.setItem("theme", nextTheme);
    setTheme(nextTheme);
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

  useEffect(() => {
    setSearch('');
  }, [location.pathname]);


  return (
    <header className="fixed top-0 left-0 w-full z-40 bg-[rgba(var(--card),1)] text-copy-primary shadow-md px-8 py-4 flex items-center justify-between transition-colors">

      {/* Logo */}
      <Link to="/" className="flex items-center">
        <img
          src={theme === 'dark' ? '/images/bookify_logo_d.png' : '/images/bookify_logo.png'}
          alt="Bookify logo"
          className="h-full max-h-12 transition-all"
        />

      </Link>

      {/* Search + Category filter */}
      <form
        onSubmit={handleSearch}
        className="w-full max-w-[clamp(240px,60%,640px)]"
      >
        <div className="flex flex-col sm:flex-row items-stretch bg-[rgba(var(--bookcard),1)] border border-border rounded-full overflow-hidden shadow-sm">
          {/* Category */}
          <div className="flex items-center border-b sm:border-b-0 sm:border-r border-border px-4 py-2">
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="text-sm text-copy-primary bg-[rgba(var(--bookcard),1)] focus:outline-none"
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
              className="flex-1 px-4 py-2 text-sm bg-[rgba(var(--bookcard),1)] text-copy-primary focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2 text-cta border-none outline-none focus:outline-none focus:ring-0 focus:border-none active:outline-none active:border-none"
            >
              <Search size={18} />
            </button>
          </div>
        </div>
      </form>

      {/* Right actions */}
      <div className="flex items-center gap-4 relative">

        <button
          onClick={toggleTheme}
          className="text-copy-primary hover:text-cta transition "
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        {user && (
          <>
            <Link to="/profile" className="hover:text-cta transition">
              <User size={20} className='text-copy-primary' />
            </Link>
            <Link to="/notifications" className="hover:text-cta transition">
              <Bell size={20} className='text-copy-primary' />
            </Link>
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="text-copy-primary bg-border hover:bg-border/80 p-2 rounded-full transition"
              >
                <Menu size={24} />
              </button>
              {showMenu && (
                <div
                  ref={menuRef}
                  className="bg-[rgba(var(--bookcard),1)] absolute right-0 top-full mt-2 shadow-xl rounded-lg p-4 w-60 z-50"
                >
                  <div className="flex flex-col gap-1">
                    <Link to="/myBooks" className="flex items-center gap-2 py-2 hover:text-cta w-full">
                      <BookOpen size={18} className='text-copy-primary' /> <span className="text-copy-primary w-full">My Books</span>
                    </Link>
                    <Link to="/wishlist" className="flex items-center gap-2 py-2 hover:text-cta w-full">
                      <Heart size={18} className='text-copy-primary' /> <span className="text-copy-primary w-full">Wish List</span>
                    </Link>
                    <hr className="my-2 border-t border-border" />
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
          <Button
            onClick={onLoginClick}
            className="bg-cta hover:bg-cta-active text-cta-text px-4 py-1.5 rounded-md transition"
          >
            Login
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
