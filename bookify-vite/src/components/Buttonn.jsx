import { useNavigate } from "react-router-dom";

const Buttonn = ({
  isBorrowed = false,
  onToggle,
  redirectToBookPage = false,
  bookId,
  className = "",
  variant = "default",
  children,
  icon = null,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (redirectToBookPage && bookId) {
      navigate(`/book/${bookId}`);
    } else {
      onToggle?.();
    }
  };

  const baseClasses =
    "font-semibold px-6 py-2 rounded-full cursor-pointer transition-all flex items-center gap-2";
  const variants = {
    default:
      "border border-teal-700 text-teal-700 hover:bg-teal-50 dark:hover:bg-teal-800/20",
    login: "bg-blue-600 text-white hover:bg-blue-700",
    return:
      "border border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-800/20",
    trash:
      "border border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-800/20",
    genre: "bg-[rgb(3,90,117)] text-white hover:bg-[rgb(22,50,70)]",
  };

  const combinedClasses = `${baseClasses} ${variants[variant] || variants.default
    } ${className}`;

  return (
    <span onClick={handleClick} type="button" className={combinedClasses}>
      {icon && <span>{icon}</span>}
      {children ?? (isBorrowed ? "Return" : "Borrow")}
    </span>
  );
};

export default Buttonn;