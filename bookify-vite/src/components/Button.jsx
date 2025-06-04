// src/components/Button.jsx
const Button = ({ label, onClick, variant = "primary", icon: Icon, disabled = false }) => {
  const base = "px-4 py-2 rounded text-sm font-medium transition";
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-300 text-black hover:bg-gray-400",
    danger: "bg-red-600 text-white hover:bg-red-700",
    outline: "border border-gray-500 text-gray-700 hover:bg-gray-100",
    disabled: "bg-gray-300 text-gray-500 cursor-not-allowed",
  };

  const style = `${base} ${disabled ? variants.disabled : variants[variant]}`;

  return (
    <button onClick={onClick} className={style} disabled={disabled}>
      {Icon && <Icon className="inline-block w-4 h-4 mr-2" />}
      {label}
    </button>
  );
};

export default Button;
