import AdminBookCard from './AdminBookCard';

const UnavailableBooksSection = ({ books }) => {
  const unavailable = books.filter(b => b.available_copies === 0);
  return (
    <div className="mb-10">
      <h3 className="text-xl font-semibold mb-2">Unavailable Books</h3>
      <div className="grid gap-4">
        {unavailable.map(book => (
          <AdminBookCard key={book.book_id} book={book} />
        ))}
      </div>
    </div>
  );
};

export default UnavailableBooksSection;
