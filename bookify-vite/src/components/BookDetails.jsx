import Button from './Button';
const BookDetails = ({ book, onBorrow, onToggleWishlist, isBorrowed, isWished }) => {
  if (!book) {
    return <p className="text-gray-500 text-center">No book selected.</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-2">{book.title}</h2>
      <p className="text-gray-700 mb-1">Author: <span className="font-medium">{book.author}</span></p>
      <p className="text-gray-600 mb-4">{book.description || 'No description available.'}</p>

      <div className="flex gap-3 mb-4 flex-wrap">
        <Button
          label={isBorrowed ? 'Return' : 'Borrow'}
          variant="primary"
          onClick={onBorrow}
        />
        <Button
          label={isWished ? 'Remove from Wishlist' : 'Add to Wishlist'}
          variant="secondary"
          onClick={onToggleWishlist}
        />
      </div>

      <p className="text-sm text-gray-500">
        Copies available: {book.copies_available ?? 'Unknown'}
      </p>
    </div>
  );
};

export default BookDetails;
