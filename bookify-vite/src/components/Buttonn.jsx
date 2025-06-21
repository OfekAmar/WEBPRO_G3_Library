import { useNavigate } from 'react-router-dom';
 
const Buttonn = ({
  isBorrowed = false,
  onToggle,
  redirectToBookPage = false,
  bookId,
  className = ''
  
}) => {
  const navigate = useNavigate();
 
  const handleClick = () => {
    if (redirectToBookPage && bookId) {
      navigate(`/book/${bookId}`);
    } else {
      onToggle?.();
    }
  };
 
  return (
<span
      onClick={handleClick}
      type="button"
      className={`border border-teal-700 text-teal-700 font-semibold px-6 py-2 rounded-full hover:bg-teal-50 dark:hover:bg-teal-800/20 cursor-pointer transition-all ${className}`}
>
      {isBorrowed ? 'Return' : 'Borrow'}
</span>
  );
};
 
export default Buttonn;