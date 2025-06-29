// components/RecommendationChatBot.jsx
import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { ref, get } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { resolveBookCover } from "../utils/fetchGoogleBookCover";
import { ArrowRight } from "lucide-react";
import { FaArrowRight } from "react-icons/fa6";
import Buttonn from "./Buttonn";

function RecommendationChatBot({ hidden }) {
	if (hidden) return null;
	const [isOpen, setIsOpen] = useState(false);
	const [step, setStep] = useState(0);
	const [genre, setGenre] = useState("");
	//const [author, setAuthor] = useState("");
	const [book, setBook] = useState(null);
	//const [availableAuthors, setAvailableAuthors] = useState([]);
	const [cover, setCover] = useState(null);
	const [lengthCategory, setLengthCategory] = useState("");
	const [availableLengths, setAvailableLengths] = useState([]);
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
		setAvailableLengths(["Short", "Medium", "Long"]);
		setStep(1);
	};

	const handleLengthSelect = (length) => {
		setLengthCategory(length);
		setStep(2);
	};

	useEffect(() => {
		if (step === 2) {
			get(ref(db, "books")).then(async (snapshot) => {
				const data = snapshot.val();
				if (!data) return;

				const filtered = Object.values(data).filter(
					(book) =>
						book.subject === genre &&
						((lengthCategory === "Short" && book.number_of_pages < 150) ||
							(lengthCategory === "Medium" &&
								book.number_of_pages >= 150 &&
								book.number_of_pages <= 300) ||
							(lengthCategory === "Long" && book.number_of_pages > 300))
				);

				if (filtered.length === 0) {
					setBook(null);
					setCover(null);
					setStep(3);
					return;
				}

				const randomBook =
					filtered[Math.floor(Math.random() * filtered.length)];
				setBook(randomBook);

				const resolvedCover = await resolveBookCover(randomBook);
				setCover(resolvedCover);

				setStep(3);
			});
		}
	}, [step]);

	return (
		<>
			<Buttonn
				onToggle={() => setIsOpen((prev) => !prev)}
				variant="pill"
				className="fixed bottom-6 right-6 z-50 shadow-lg text-sm px-8 py-4"
			>
				Recommendation Bot
			</Buttonn>
			{isOpen && (
				<div className="fixed bottom-20 right-6 bg-[rgba(var(--bookcard),1)] rounded-xl shadow-lg w-96 max-w-full p-6 z-50 transition-colors">
					{step === 0 && (
						<div>
							<h2 className="text-xl font-bold mb-4 text-center">
								Book Recommendation
							</h2>
							<p className="mb-3 text-center">
								What genre are you in the mood for today?
							</p>
							<div className="flex flex-col gap-2 px-2">
								{["Fantasy", "Mystery", "Romance", "Sci-Fi"].map((g) => (
									<Buttonn
                                        variant="bot1"
										key={g}
										onToggle={() => handleGenreSelect(g)}
									>
										{g}
									</Buttonn>
								))}
							</div>
						</div>
					)}
					{step === 1 && (
						<div>
							<button
								onClick={() => setStep(0)}
								className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
								aria-label="Back to genre"
							>
								<FaArrowRight />
							</button>
							<h2 className="text-xl font-bold mb-4 text-center">
								Book Recommendation
							</h2>
							<p className="mb-2 text-center">
								How long a book are you up for?
							</p>
							<div className="flex flex-col gap-2 px-2">
								{availableLengths.map((l) => (
									<Buttonn
										variant="bot2"
										key={l}
										onToggle={() => handleLengthSelect(l)}
									>
										{l}
									</Buttonn>
								))}
							</div>
						</div>
					)}
					{step === 3 && (
						<div className="relative flex flex-col items-center gap-4 text-center">
							{book ? (
								<>
									<h2 className="text-lg font-semibold">
										Here's my recommendation:
									</h2>
									<h3 className="text-2xl font-bold">{book.name}</h3>
									<p className="text-base italic">{book.author}</p>

									<div className="relative">
										{cover ? (
											<img
												src={cover}
												alt={book.name}
												className="h-64 rounded shadow-md border border-gray-300 object-contain"
											/>
										) : (
											<div className="h-64 w-40 bg-gray-200 animate-pulse rounded" />
										)}
									</div>

									<Buttonn
                                        variant="bot3"
										onToggle={() => navigate(`/book/${book.book_id}`)}
										
									>
										Go to Book <ArrowRight size={16} />
									</Buttonn>

									<Buttonn
                                        variant="bot4"
										onToggle={resetBot}
									>
										New Recommendation
									</Buttonn>
								</>
							) : (
								<>
									<button
										onClick={() => setStep(1)}
										className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
										aria-label="Back to length selection"
									>
										<FaArrowRight />
									</button>
									<p className="text-red-500">No book found</p>
									<p className="text-gray-600">
										Try selecting a different length
									</p>
								</>
							)}
						</div>
					)}
				</div>
			)}
		</>
	);
}

export default RecommendationChatBot;
