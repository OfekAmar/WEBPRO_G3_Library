import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { ref, get, update } from "firebase/database";
import Layout from "../Layout/Layout";
import Button from "../components/Button";
import Buttonn from "../components/Buttonn";
import { Trash2 } from "lucide-react";
import { resolveBookCover } from "../utils/fetchGoogleBookCover";
import { useNavigate } from "react-router-dom";
import BorrowButton from "../components/BorrowButton";

function MyWishlistPage({ user }) {
	const [wishlistBooks, setWishlistBooks] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const booksPerPage = 4;
	const [covers, setCovers] = useState({});
	const navigate = useNavigate();

	useEffect(() => {
		if (!user) return;
		// Fetch user's wishlist books and load cover images
		const fetchWishlist = async () => {
			const userSnap = await get(ref(db, `users/${user.userIndex}/wishlist`));
			const wishlist = userSnap.val() || [];

			const booksSnap = await get(ref(db, "books"));
			const allBooks = booksSnap.val() || {};

			const booksInWishlist = wishlist
				.map((bookId) => allBooks[bookId])
				.filter(Boolean);

			setWishlistBooks(booksInWishlist);

			const coversMap = {};
			for (const book of booksInWishlist) {
				const cover = await resolveBookCover(book);
				coversMap[book.book_id] = cover;
			}
			setCovers(coversMap);
		};

		fetchWishlist();
	}, [user]);

	// Remove book from user's wishlist and update local state
	const handleRemove = async (bookId) => {
		const userRef = ref(db, `users/${user.userIndex}/wishlist`);
		const snap = await get(userRef);
		const list = snap.val() || [];
		const updatedList = list.filter((id) => String(id) !== String(bookId));

		await update(ref(db, `users/${user.userIndex}`), {
			wishlist: updatedList,
		});

		setWishlistBooks((prev) =>
			prev.filter((book) => String(book.book_id) !== String(bookId))
		);
	};

	// Navigate to individual book page
	const handleNavigateToBook = (book) => {
		navigate(`/book/${book.book_id}`);
	};

	if (!user) {
		return (
			<p className="p-6 text-red-500">
				You must be logged in to view your wishlist.
			</p>
		);
	}

	// Page amount calculation logic for wishlist books
	const indexOfLast = currentPage * booksPerPage;
	const indexOfFirst = indexOfLast - booksPerPage;
	const currentBooks = wishlistBooks.slice(indexOfFirst, indexOfLast);
	const totalPages = Math.ceil(wishlistBooks.length / booksPerPage);

	return (
		<>
			<div className="p-6 max-w-5xl mx-auto">
				<h2 className="text-2xl font-bold mb-6 text-center text-copy-primary">
					My Wishlist
				</h2>

				{wishlistBooks.length === 0 ? (
					<p className="text-copy-secondary text-center">
						Your wishlist is empty.
					</p>
				) : (
					<div className="space-y-6">
						{currentBooks.map((book) => (
							<div
								key={book.book_id}
								className="flex flex-col md:flex-row items-start gap-6 bg-[rgba(var(--bookcard),1)] text-copy-primary rounded-lg shadow p-4"
							>
								<img
									src={covers[book.book_id]}
									alt={book.name}
									className="w-40 h-56 object-cover rounded"
								/>
								<div className="flex-1">
									<h3 className="text-xl font-semibold mb-2">{book.name}</h3>
									<p className="text-sm text-copy-secondary mb-4">
										{book.description}
									</p>
									<div className="flex items-center gap-3">
										<Buttonn redirectToBookPage={true} bookId={book.book_id} />

										<Buttonn
											variant="trash"
											onToggle={() => handleRemove(book.book_id)}
											className="text-red-500 hover:text-red-700 dark:hover:bg-red-800/20"
											icon={<Trash2 size={23} />}
											children=""
										/>
									</div>
								</div>
							</div>
						))}

						{totalPages > 1 && (
							<div className="flex justify-center mt-6 gap-2">
								{Array.from({ length: totalPages }, (_, i) => (
									<button
										key={i + 1}
										className={`px-3 py-1 rounded font-medium transition-colors ${
											currentPage === i + 1
												? "bg-[rgba(var(--bookcard),1)] text-cta-text"
												: "bg-border text-copy-primary hover:bg-border/80"
										}`}
										onClick={() => setCurrentPage(i + 1)}
									>
										{i + 1}
									</button>
								))}
							</div>
						)}
					</div>
				)}
			</div>
		</>
	);
}

export default MyWishlistPage;
