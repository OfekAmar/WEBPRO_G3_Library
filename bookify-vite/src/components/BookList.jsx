import BookCard from './BookCard';



const BookList = ({ books = [], onBookClick }) => {
  if (books.length === 0) {
    return <p className="text-gray-500 text-center mt-6">No books available.</p>;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {books.map((book) => (
        <BookCard
          key={book.book_id || book.id}
          title={book.title}
          author={book.author}
          onClick={() => onBookClick?.(book)}
        />
      ))}
    </div>
  );
};

export default BookList;
