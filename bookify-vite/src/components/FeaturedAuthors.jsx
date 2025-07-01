
import React, { useEffect, useState } from 'react';
import { get, ref } from 'firebase/database';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';

const FeaturedAuthors = () => {
  const [authors, setAuthors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch authors from Firebase, shuffle list, and select featured authors
    const fetchAuthors = async () => {
      const snapshot = await get(ref(db, 'authors'));
      const data = snapshot.val();
      if (!data) return;

      // Use author's image if available; otherwise generate a default avatar using UI Avatars service
      const authorList = Object.entries(data).map(([_, author]) => ({
        name: author.name,
        books: author.books || 0,
        image: author.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(author.name)}&background=random&color=fff`
      }));

      const shuffled = authorList.sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, 6);

      setAuthors(selected);
    };

    fetchAuthors();
  }, []);


  return (
    <section className="py-12 text-center w-full bg-[rgba(var(--backgroundhomepage),1)] text-[rgba(var(--copy-primary),1)] transition-colors">
      <h2 className="text-3xl font-bold mb-2">Featured Author</h2>
      <p className="mb-8 text-[rgba(var(--copy-secondary),1)]">
        Click on them to see their available books
      </p>

      <div className="max-w-7xl mx-auto grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 px-4">
        {authors.map((author, idx) => (
          <div
            key={idx}
            onClick={() => navigate(`/search?q=${encodeURIComponent(author.name)}&by=author`)}
            className="cursor-pointer rounded-xl p-4 bg-[rgba(var(--card),1)] hover:shadow-lg transition-all flex flex-col items-center text-center text-[rgba(var(--copy-primary),1)]"
          >
            <div className="relative w-24 h-24 mb-3">
              <div className="circle-shape absolute inset-0 animate-rotate-circle">
                <div className="w-full h-full rounded-full border-2 border-dashed border-[rgb(3,90,117)] animate-cir36" />
              </div>
              <div className="absolute inset-2 flex items-center justify-center">
                <img
                  src={author.image}
                  alt={author.name}
                  className="w-full h-full object-cover rounded-full border-4 border-white z-10"
                />
              </div>
            </div>
            <p className="font-semibold">{author.name}</p>
            <p className="text-sm text-[rgba(var(--copy-secondary),1)]">
              {String(author.books).padStart(2, '0')} Published Books
            </p>
          </div>

        ))}
      </div>
    </section>

  );
};

export default FeaturedAuthors;
