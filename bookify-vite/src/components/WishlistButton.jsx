
{/*
const WishlistButton = ({ isWished, onToggle }) => {
  return (
    <Button
      label={isWished ? 'Remove from Wishlist' : 'Add to Wishlist'}
      variant="secondary"
      onClick={onToggle}
    />
  );
};

export default WishlistButton;
*/}

const WishlistButton = ({ isWished, onToggle }) => {
  return (
    <span
      onClick={onToggle}
      type="button"
      title={isWished ? 'Remove from Wishlist' : 'Add to Wishlist'}
      className={`
    w-10 h-10 rounded-full flex items-center justify-center
    border border-gray-300 text-gray-600 hover:bg-gray-100
    transition duration-200 cursor-pointer
    ${isWished ? 'text-red-500' : ''}
  `}
    >
      <i className="fa-solid fa-heart"></i>
    </span>
  );
};

export default WishlistButton;