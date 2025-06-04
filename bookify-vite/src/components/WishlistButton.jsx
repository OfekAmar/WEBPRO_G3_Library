import Button from './Button';

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
