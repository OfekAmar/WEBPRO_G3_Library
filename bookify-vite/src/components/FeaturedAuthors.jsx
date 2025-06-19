
import React, { useEffect, useState } from 'react';
import { get, ref } from 'firebase/database';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';

const FeaturedAuthors = () => {
  const [authors, setAuthors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuthors = async () => {
      const snapshot = await get(ref(db, 'books'));
      const data = snapshot.val();
      if (!data) return;

      const bookList = Object.values(data);
      const authorMap = {};

      bookList.forEach(book => {
        const name = book.author;
        if (!name) return;
        if (!authorMap[name]) {
          authorMap[name] = {
            name,
            books: 0,
            image: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&bold=true`
          };
        }
        authorMap[name].books += 1;
      });

      const uniqueAuthors = Object.values(authorMap);
      const shuffled = uniqueAuthors.sort(() => Math.random() - 0.5);
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
            className="cursor-pointer rounded-xl p-4 shadow bg-[rgba(var(--bookcard),1)] hover:bg-[rgba(var(--bookcard),0.85)] transition-all"
          >
            <div className="flex justify-center mb-3 relative">
              <img
                src={author.image}
                className="w-24 h-24 object-cover rounded-full border-4 border-white shadow-md mx-auto z-10"
                alt={author.name}
              />
            </div>
            <p className="font-semibold text-cta">{author.name}</p>
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
