import { useNavigate } from 'react-router-dom';

const BookCard = ({ book }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    sessionStorage.setItem("selectedBook", JSON.stringify(book));
    navigate("/book");
  };

  return (
    <div
      onClick={handleClick}
      className="bg-gray-100 rounded-lg shadow p-3 w-60 h-80 flex flex-col items-center m-2 cursor-pointer"
    >
      <img
        src={book.photo}
        alt={book.name}
        className="w-50 h-58 object-cover rounded mb-2"
      />
      <p className="font-semibold text-md text-center">{book.name}</p>
      <p className="text-xs text-gray-600 text-center">{book.author}</p>
    </div>
  );
};

export default BookCard;