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
			"bg-[rgb(3,90,117)] text-white hover:bg-[rgb(22,50,70)] hover:text-white transition-all",
		login: "bg-blue-600 text-white hover:bg-blue-700",
		return:
			"border border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-800/20",
		trash:
			"border border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-800/20",
		genre:
			"border border-[rgb(3,90,117)] text-[rgb(3,90,117)] font-semibold hover:bg-[rgb(3,90,117)] hover:text-white transition-all",
		login: "bg-blue-600 text-white hover:bg-blue-700",
		loginactive:
			"bg-[rgb(3,90,117)] text-white hover:bg-[rgb(22,50,70)] cursor-pointer",
		logindisabled:
			"bg-[rgba(var(--border),1)] text-gray-400 cursor-not-allowed",
		registeractive:
			"bg-[rgb(3,90,117)] text-white hover:bg-[rgb(22,50,70)] cursor-pointer",
		registerdisabled:
			"bg-[rgba(var(--border),1)] text-gray-400 cursor-not-allowed",
		pill: "inline-flex items-center justify-center px-6 py-2 text-white text-sm font-bold rounded-full bg-[rgb(3,90,117)] hover:bg-[rgb(22,50,70)] transition-all shadow",
		bot1: "min-w-[80px] min-h-[40px] gap-2 bg-[rgb(45,140,169)] hover:bg-[rgb(39,65,84)] text-white text-sm rounded-full ",
		bot2: "bg-[rgb(45,140,169)] hover:bg-[rgb(39,65,84)] text-white text-sm rounded",
		bot3: "flex items-center gap-2 px-4 py-2 bg-[rgb(45,140,169)] hover:bg-[rgb(39,65,84)] text-white font-semibold rounded shadow",
		bot4: "mt-2 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded",
		okMes:
			"mt-6 w-10 h-10 mx-auto bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 transition text-sm font-semibold",
		lateMes:
			"mt-6 w-10 h-10 mx-auto bg-yellow-500 text-white rounded-full flex items-center justify-center hover:bg-yellow-600 transition text-sm font-semibold",
	};

	const combinedClasses = `${baseClasses} ${
		variants[variant] || variants.default
	} ${className}`;

	return (
		<span onClick={handleClick} type="button" className={combinedClasses}>
			{icon && <span>{icon}</span>}
			{children ?? (isBorrowed ? "Return" : "Borrow")}
		</span>
	);
};

export default Buttonn;
