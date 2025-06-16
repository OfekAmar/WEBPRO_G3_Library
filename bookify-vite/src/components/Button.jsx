// src/components/Button.jsx
import React from "react";

const Button = ({
  label,
  onClick,
  variant = "primary",
  icon,
  iconSize = 20,
  disabled = false,
  children,
  className = "",
}) => {
  const base = "appearance-none rounded text-sm font-medium transition";

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 px-4 py-2",
    secondary: "bg-gray-300 text-black hover:bg-gray-400 px-4 py-2",
    danger: "bg-red-600 text-white hover:bg-red-700 px-4 py-2",
    outline: "border border-gray-500 text-gray-700 hover:bg-gray-100 px-4 py-2",
    disabled: "bg-gray-300 text-gray-500 cursor-not-allowed px-4 py-2",
    carousel: "bg-[rgba(var(--bookcard),1)] text-copy-primary shadow p-2 rounded-full hover:bg-gray-100",
    teal: "w-22 h-10 rounded-full bg-yellow-700 text-white hover:bg-yellow-800",
    pill: "flex items-center border border-teal-700 rounded-full text-teal-800 font-semibold text-sm overflow-hidden transition hover:bg-teal-50 px-4 py-2",
    borrow: "border border-teal-700 text-teal-700 font-semibold px-6 py-2 rounded-full hover:bg-teal-50 cursor-pointer transition-all",
    trash: "border border-red-600 text-red-600 font-semibold px-6 py-2 rounded-full hover:bg-red-50 cursor-pointer transition-all",
    read: "w-8 h-8 border border-indigo-700 text-indigo-700 font-semibold rounded-full hover:bg-red-50 cursor-pointer transition-all flex items-center justify-center",
    return: "bg-green-600 text-white font-semibold px-6 py-2 rounded-full hover:bg-green-700 cursor-pointer transition-all border border-green-700"
  };

  const style = `${base} ${disabled ? variants.disabled : variants[variant]} ${className}`;

  const renderIcon = () => {
    if (!icon) return null;

    // JSX: e.g. icon={<Trash2 size={16} />}
    if (React.isValidElement(icon)) {
      return (
        <span className={`${!label && !children ? "mx-auto" : "inline-block mr-2"}`}>
          {icon}
        </span>
      );
    }

    // Functional Component: e.g. icon={Trash2}
    if (typeof icon === "function") {
      const IconComponent = icon;
      return (
        <IconComponent
          size={iconSize}
          className={`${!label && !children ? "mx-auto" : "inline-block mr-2"}`}
        />
      );
    }

    return null;
  };

  return (
    <button onClick={onClick} className={style} disabled={disabled}>
      {renderIcon()}
      {label}
      {children}
    </button>

  );
};

export default Button;
