
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
    <sapn
      onClick={onToggle}
      className={`
        w-10 h-10 rounded-full flex items-center justify-center
        border border-gray-300 text-gray-600 hover:bg-gray-100 transition
        ${isWished ? 'text-red-500' : ''}
      `}
      aria-label="Toggle Wishlist"
      type="button"
    >
      <i className="fa-solid fa-heart"></i>
    </sapn>
  );
};

export default WishlistButton;