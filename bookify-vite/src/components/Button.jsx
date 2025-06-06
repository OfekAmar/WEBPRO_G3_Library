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
  const base = "appearance-none bg-transparent border-none px-4 py-2 rounded text-sm font-medium transition";


  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-300 text-black hover:bg-gray-400",
    danger: "bg-red-600 text-white hover:bg-red-700",
    outline: "border border-gray-500 text-gray-700 hover:bg-gray-100",
    disabled: "bg-gray-300 text-gray-500 cursor-not-allowed",
    carousel: "bg-white !important text-gray-800 shadow p-2 rounded-full hover:bg-gray-100",
    teal: "w-22 h-10 rounded-full bg-yellow-700 text-white hover:bg-yellow-800",
  };

  const style = `${base} ${disabled ? variants.disabled : variants[variant]} ${className}`;

  return (
    <button onClick={onClick} className={style} disabled={disabled}>
      {Icon && <Icon className="inline-block w-4 h-4 mr-2" />}
      {label}
      {children}
    </button>
  );
};

export default Button;
