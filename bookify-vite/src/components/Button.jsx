// src/components/Button.jsx
const Button = ({
  label,
  onClick,
  variant = "primary",
  icon: Icon,
  disabled = false,
  children,
  className = "",
}) => {
  const base = "appearance-none px-4 py-2 rounded text-sm font-medium transition";


  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-300 text-black hover:bg-gray-400",
    danger: "bg-red-600 text-white hover:bg-red-700",
    outline: "border border-gray-500 text-gray-700 hover:bg-gray-100",
    disabled: "bg-gray-300 text-gray-500 cursor-not-allowed",
    carousel: "bg-white !important text-gray-800 shadow p-2 rounded-full hover:bg-gray-100",
    teal: "w-22 h-10 rounded-full bg-yellow-700 text-white hover:bg-yellow-800",
    pill: "flex items-center border border-teal-700 rounded-full text-teal-800 font-semibold text-sm overflow-hidden transition hover:bg-teal-50",
    borrow: "!border border-teal-700 text-teal-700 font-semibold px-6 py-2 rounded-full hover:bg-teal-50 cursor-pointer transition-all",
    trash: "border border-red-600 text-red-600 font-semibold px-6 py-2 rounded-full hover:bg-red-50 cursor-pointer transition-all",
    read: "border border-teal-600 text-teal-600 font-semibold px-6 py-2 rounded-full hover:bg-red-50 cursor-pointer transition-all",
    return: "bg-green-600 text-white font-semibold px-6 py-2 rounded-full hover:bg-green-700 cursor-pointer transition-all border border-green-700"
  };

  const style = `${base} ${disabled ? variants.disabled : variants[variant]} ${className}`;

  return (
    <button onClick={onClick} className={style} disabled={disabled}>
      {Icon && <Icon className={`w-5 h-5 ${!label && !children ? 'mx-auto' : 'inline-block mr-2'}`} />}
      {label}
      {children}
    </button>

  );
};

export default Button;
