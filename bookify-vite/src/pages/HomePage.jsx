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

function HomePage() {
  const [books, setBooks] = useState({ trending: [], new: [] });
  const navigate = useNavigate();

  const trendingRef = useRef();
  const newRef = useRef();

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
        .slice(0, 5);

      const ratedIds = new Set(ratedBooks.map(b => b.book_id));
      const newBooks = allBooks.filter(b => !ratedIds.has(b.book_id));

      setBooks({ trending: ratedBooks, new: newBooks });
    };

    fetchBooks();
  }, []);

  const scrollCarousel = (ref, direction = 'left') => {
    if (ref.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const renderCarousel = (title, booksArray, refName) => (
    <div className="relative mb-12">
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <Button
        variant="carousel"
        onClick={() => scrollCarousel(refName, 'left')}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10"
      >
        <ChevronLeft size={24} />
      </Button>

      <div
        ref={refName}
        className="overflow-x-auto flex gap-4 pb-4 scroll-smooth px-6"
        style={{ scrollbarWidth: 'none' }}
      >
        {booksArray.map(book => (
          <BookCard
            key={book.id}
            book={book}
            onClick={() => {
              sessionStorage.setItem('selectedBook', JSON.stringify(book));
              navigate('/book');
            }}
          />
        ))}
      </div>

      <Button
        variant="carousel"
        onClick={() => scrollCarousel(refName, 'right')}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10"
      >
        <ChevronRight size={24} />
      </Button>
    </div>
  );

  return (
    <>
      <div className="w-full bg-[#d8eef5]">
        <img
          src="logos\final.png"
          alt="Welcome to Bookify"
          className="w-full max-w-none"
        />
      </div>
      <section className="p-6 max-w-6xl mx-auto">
        {renderCarousel('📈 Trending Books', books.trending, trendingRef)}
        {renderCarousel('🆕 Newly Added Books', books.new, newRef)}
      </section>

      <Footer />
    </>
  );
}

export default HomePage;
