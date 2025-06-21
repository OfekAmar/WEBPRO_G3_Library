import React, { useEffect, useState, useRef } from "react";
import { db } from "../firebase";
import { ref, get } from "firebase/database";
import BookCard from "../components/BookCard";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "../components/Button";
import FeaturedAuthors from "../components/FeaturedAuthors";
import RecommendationChatBot from "../components/RecommendationChatBot";
import Footer from "../components/Footer";
import Buttonn from "../components/Buttonn";

function HomePage() {
	const [books, setBooks] = useState({ trending: [], new: [] });
	const [genres, setGenres] = useState([]);
	const [theme, setTheme] = useState("light");
	const navigate = useNavigate();
	const trendingRef = useRef();
	const newRef = useRef();

	useEffect(() => {
		const fetchBooks = async () => {
			const snapshot = await get(ref(db, "books"));
			const data = snapshot.val();
			const allBooks = Object.entries(data || {})
				.filter(([_, book]) => book !== null)
				.map(([_, book]) => ({ ...book, id: book.book_id }));

			const ratedBooks = allBooks
				.filter((book) => typeof book.rate === "number")
				.sort((a, b) => b.rate - a.rate)
				.slice(0, 6);

			const ratedIds = new Set(ratedBooks.map((b) => b.book_id));
			const newBooks = allBooks
				.filter((b) => !ratedIds.has(b.book_id))
				.sort((a, b) => b.book_id - a.book_id)
				.slice(0, 8);

			const genreSet = new Set(
				allBooks.map((book) => book.subject).filter(Boolean)
			);

			setBooks({ trending: ratedBooks, new: newBooks });
			setGenres([...genreSet].sort());
		};

		fetchBooks();

		const updateTheme = () => {
			const isDark = document.body.classList.contains("dark");
			setTheme(isDark ? "dark" : "light");
		};

		updateTheme();
		const observer = new MutationObserver(updateTheme);
		observer.observe(document.body, {
			attributes: true,
			attributeFilter: ["class"],
		});

		return () => observer.disconnect();
	}, []);

	const scrollCarousel = (ref, direction = "left") => {
		if (ref.current) {
			const scrollAmount = direction === "left" ? -300 : 300;
			ref.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
		}
	};

	const renderCarousel = (title, booksArray, refName) => (
		<div className="relative mb-12">
			<h3 className="text-3xl font-bold text-copy-primary mb-2 text-center">
				{title}
			</h3>
			<div className="relative w-full px-6">
				<Button
					variant="carousel"
					onClick={() => scrollCarousel(refName, "left")}
					className="absolute -left-2 sm:-left-4 top-1/2 -translate-y-1/2 z-10 p-1 sm:p-2"
				>
					<ChevronLeft size={18} />
				</Button>

				<div
					ref={refName}
					className="overflow-x-auto flex gap-4 pb-4 scroll-smooth px-6"
					style={{ scrollbarWidth: "none" }}
				>
					{booksArray.map((book) => (
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
					onClick={() => scrollCarousel(refName, "right")}
					className="absolute -right-2 sm:-right-4 top-1/2 -translate-y-1/2 z-10 p-1 sm:p-2"
				>
					<ChevronRight size={18} />
				</Button>
			</div>
		</div>
	);

	const GenreCarousel = ({ genres, onSelect }) => {
		const scrollRef = useRef();

		const scroll = (dir) => {
			if (scrollRef.current) {
				console.log("scrolling", dir); // הוסיפי שורת בדיקה
				const offset = dir === "left" ? -300 : 300;
				scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
			}
		};

		if (!genres.length) return null;

		return (
			<div className="relative mb-12">
				<h3 className="text-3xl font-bold text-copy-primary mb-2 text-center">
					Explore Genres
				</h3>
				<div className="relative w-full px-6">
					<Button
						onClick={() => scroll("left")}
						variant="carousel"
						className="absolute -left-2 sm:-left-4 top-1/2 -translate-y-1/2 z-10 p-1 sm:p-2"
					>
						<ChevronLeft size={16} />
					</Button>

					<div
						ref={scrollRef}
						className="flex gap-2 overflow-x-auto scroll-smooth px-4 py-1"
						style={{ scrollbarWidth: "none" }}
					>
						{genres.map((genre) => (
							<Buttonn
								key={genre}
								variant="genre"
								onToggle={() =>
									onSelect
										? onSelect(genre)
										: navigate(
												`/search?by=subject&q=${encodeURIComponent(genre)}`
										  )
								}
								className="text-xs px-4 py-1 whitespace-nowrap"
							>
								{genre}
							</Buttonn>
						))}
					</div>

					<Button
						onClick={() => scroll("right")}
						variant="carousel"
						className="absolute -right-2 sm:-right-4 top-1/2 -translate-y-1/2 z-10 p-1 sm:p-2"
					>
						<ChevronRight size={16} />
					</Button>
				</div>
			</div>
		);
	};

	return (
		<>
			<div className="w-full bg-background relative">
				<img
					key={theme}
					src={
						theme === "dark"
							? "/images/homepage_dark.png"
							: "/images/homepage_light.png"
					}
					alt="Welcome to Bookify"
					className="w-full max-w-none transition-all duration-500"
				/>
			</div>

			<section className="p-6 max-w-6xl mx-auto">
				<GenreCarousel genres={genres} />
			</section>

			<section className="p-6 max-w-6xl mx-auto">
				{renderCarousel(" Trending Books", books.trending, trendingRef)}
			</section>

			<FeaturedAuthors />

			<section className="p-6 max-w-6xl mx-auto">
				{renderCarousel(" Newly Added Books", books.new, newRef)}
			</section>

			<section className="p-6 max-w-6xl mx-auto">
				<RecommendationChatBot />
			</section>

			<Footer />
		</>
	);
}

export default HomePage;
