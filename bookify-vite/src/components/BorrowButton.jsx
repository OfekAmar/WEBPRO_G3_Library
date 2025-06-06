const BorrowButton = ({ isBorrowed, onToggle }) => {
  return (
    <span
      onClick={onToggle}
      type="button"
      className="border border-teal-700 text-teal-700 font-semibold px-6 py-2 rounded-full hover:bg-teal-50 cursor-pointer transition-all"
    >
      {isBorrowed ? 'Return' : 'Borrow'}
    </span>
  );
};

export default BorrowButton;