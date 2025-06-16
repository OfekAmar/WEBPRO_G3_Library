import React, { useEffect, useState, useRef } from 'react';
import { db } from '../firebase';
import { ref, get } from 'firebase/database';
import BookCard from '../components/BookCard';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../components/Button';
import LibraryMap from '../components/LibraryMap';
import ContactBar from '../components/ContactBar';
import Footer from '../components/Footer';
import FeaturedAuthors from '../components/FeaturedAuthors';

function HomePage() {
  const [books, setBooks] = useState({ trending: [], new: [] });
  const navigate = useNavigate();
  const trendingRef = useRef();
  const newRef = useRef();
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const fetchBooks = async () => {
      const snapshot = await get(ref(db, 'books'));
      const data = snapshot.val();
      const allBooks = Object.entries(data || {})
        .filter(([_, book]) => book !== null)
        .map(([_, book]) => ({ ...book, id: book.book_id }));

      const ratedBooks = allBooks
        .filter(book => typeof book.rate === 'number')
        .sort((a, b) => b.rate - a.rate)
        .slice(0, 6);

      const ratedIds = new Set(ratedBooks.map(b => b.book_id));
      const newBooks = allBooks
        .filter(b => !ratedIds.has(b.book_id))
        .sort((a, b) => b.book_id - a.book_id)
        .slice(0, 8);

      setBooks({ trending: ratedBooks, new: newBooks });
    };

    fetchBooks();

    const updateTheme = () => {
      const isDark = document.body.classList.contains("dark");
      setTheme(isDark ? "dark" : "light");
    };

    updateTheme(); // Set initial theme

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  const scrollCarousel = (ref, direction = 'left') => {
    if (ref.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const renderCarousel = (title, booksArray, refName) => (
    <div className="relative mb-12">
      <h3 className="text-3xl font-bold text-copy-primary mb-2 text-center">{title}</h3>

      <div className="relative mx-auto" style={{ maxWidth: '1000px' }}>
        <Button
          variant="carousel"
          onClick={() => scrollCarousel(refName, 'left')}
          className="absolute -left-6 top-1/2 -translate-y-1/2 z-10 "
        >
          <ChevronLeft size={24} />
        </Button>

        <div
          ref={refName}
          className="overflow-x-auto flex gap-4 pb-4 scroll-smooth px-6"
          style={{ scrollbarWidth: 'none' }}
        >
          {booksArray.map(book => (
            <div key={book.id} className="relative group">
              <BookCard
                book={book}
                onClick={() => navigate(`/book/${book.book_id}`)}
              />
            </div>
          ))}
        </div>

        <Button
          variant="carousel"
          onClick={() => scrollCarousel(refName, 'right')}
          className="absolute -right-6 top-1/2 -translate-y-1/2 z-10"
        >
          <ChevronRight size={24} />
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <div className="w-full bg-background relative">
        <img
          key={theme} 
          src={theme === "dark" ? "/images/homepage_dark.png" : "/images/homepage_light.png"}
          alt="Welcome to Bookify"
          className="w-full max-w-none transition-all duration-500"
        />
      </div>
      <section className="p-6 max-w-6xl mx-auto">
        {renderCarousel(' Trending Books', books.trending, trendingRef)}
      </section>
      <FeaturedAuthors />
      <section className="p-6 max-w-6xl mx-auto">
        {renderCarousel(' Newly Added Books', books.new, newRef)}
      </section>

      <Footer />
    </>
  );
}

export default HomePage;
