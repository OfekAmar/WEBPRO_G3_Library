// src/components/WishlistBookCard.jsx
const WishlistBookCard = ({ book, onRemove }) => {
  return (
    <div className="bg-white border rounded p-4 shadow relative">
      <img
        src={book.photo}
        alt={book.name}
        className="w-full h-60 object-cover rounded mb-2"
      />
      <h3 className="font-bold text-lg">{book.name}</h3>
      <p className="text-sm text-gray-600 mb-2">By {book.author}</p>
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
        title="Remove from wishlist"
      >
        ❌
      </button>
    </div>
  );
};

export default WishlistBookCard;
