import Button from './Button';

const BorrowButton = ({ isBorrowed, onToggle }) => {
  return (
    <Button
      label={isBorrowed ? 'Return' : 'Borrow'}
      variant="primary"
      onClick={onToggle}
    />
  );
};

export default BorrowButton;
