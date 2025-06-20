// components/RecommendationChatBot.jsx
import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { ref, get } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { resolveBookCover } from "../utils/fetchGoogleBookCover";
import { ArrowRight } from "lucide-react";

function RecommendationChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [genre, setGenre] = useState("");
  const [author, setAuthor] = useState("");
  const [book, setBook] = useState(null);
  const [availableAuthors, setAvailableAuthors] = useState([]);
  const [cover, setCover] = useState(null);
  const navigate = useNavigate();

  const resetBot = () => {
    setStep(0);
    setGenre("");
    setAuthor("");
    setBook(null);
    setAvailableAuthors([]);
    setCover(null);
  };

  const handleGenreSelect = (g) => {
    setGenre(g);
    get(ref(db, "books")).then((snapshot) => {
      const data = snapshot.val();
      if (!data) return;

      const authors = Array.from(
        new Set(
          Object.values(data)
            .filter((book) => book.subject === g)
            .map((book) => book.author)
        )
      );

      setAvailableAuthors(authors);
      setStep(1);
    });
  };

  const handleAuthorSelect = (a) => {
    setAuthor(a);
    setStep(2);
  };

  useEffect(() => {
    if (step === 2) {
      get(ref(db, "books")).then(async (snapshot) => {
        const data = snapshot.val();
        if (!data) return;

        const filtered = Object.values(data).filter(
          (book) => book.subject === genre && (author === "any" || book.author === author)
        );

        const randomBook = filtered[Math.floor(Math.random() * filtered.length)];
        setBook(randomBook || null);

        if (randomBook) {
          const resolvedCover = await resolveBookCover(randomBook);
          setCover(resolvedCover);
        }

        setStep(3);
      });
    }
  }, [step]);

  return (
    <>
      <button
        className="fixed bottom-6 right-6 bg-[rgb(27,63,88)] hover:bg-[rgb(22,50,70)] text-white px-4 py-2 rounded-full shadow-lg z-50 text-sm font-medium"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        Recommendation Bot
      </button>

      {isOpen && (
        <div className="fixed bottom-20 right-6 bg-[rgb(50,84,110)] dark:bg-[rgb(251,251,251)] rounded-xl shadow-lg w-96 max-w-full p-6 z-50 transition-all">
          

          {step === 0 && (
            <div>
            <h2 className="text-xl font-bold mb-4 text-center">Book Recommendation</h2>
              <p className="mb-3">What genre are you in the mood for today?</p>
              <div className="grid grid-cols-4 gap-2 px-2">{["Fantasy", "Mystery", "Romance", "Sci-Fi"].map((g) => (
                <button key={g} onClick={() => handleGenreSelect(g)} className="min-w-[80px] min-h-[40px] gap-2 bg-[rgb(39,114,167)] text-white text-sm rounded  ">
                  {g}
                </button>
              ))  }
            </div>
            </div>
          )}

          {step === 1 && (
            <div>
            <h2 className="text-xl font-bold mb-4 text-center">Book Recommendation</h2>
              <p className="mb-2">Which author do you prefer?</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 px-2">
                <button
                    onClick={() => handleAuthorSelect("any")}
                    className="max-w-[100px] min-h-[20px] bg-[rgb(52,136,197)] text-white text-sm rounded"
                >
                    No preference
                </button>
                {availableAuthors.map((a) => (
                    <button key={a} onClick={() => handleAuthorSelect(a)} className="min-w-[80px] min-h-[40px] bg-[rgb(52,136,197)] text-white text-sm rounded">
                    {a}
                    </button>
                ))}
                </div>
                </div>
            )}
            

          {step === 3 && (
            <div className="mt-4 text-center">
              {book ? (
                <>
                  <h2 className="font-semibold">Here's my recommendation:</h2>
                  <h3 className="text-lg font-bold mt-2">{book.name}</h3>
                  <p className="text-sm text-[rgb(39,45,48)]">{book.author}</p>
                  <div className="flex items-center justify-center gap-4 mt-2">
                    {cover ? (
                      <img
                        src={cover}
                        alt={book.name}
                        className="h-48 object-contain rounded"
                      />
                    ) : (
                      <div className="h-48 w-32 bg-border animate-pulse rounded" />
                    )}
                    <button
                      onClick={() => navigate(`/book/${book.book_id}`)}
                      className="h-fit px-3 py-1 text-sm bg-[rgb(69,117,152)] hover:bg-[rgb(57,99,129)] text-white rounded flex items-center gap-1"
                    >
                      Go to Book <ArrowRight size={16} />
                    </button>
                  </div>
                  <div className="flex justify-center mt-3">
                    <button
                      onClick={resetBot}
                      className="px-3 py-1 text-sm bg-[rgb(157,183,201)] text-white rounded hover:bg-[rgb(139,167,186)]"
                    >
                      New Recommendation
                    </button>
                  </div>
                </>
              ) : (
                <p>No suitable book found</p>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default RecommendationChatBot;
