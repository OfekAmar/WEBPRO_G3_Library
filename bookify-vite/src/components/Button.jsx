// src/components/Button.jsx
import React from "react";

const Button = ({
  label,
  onClick,
  variant = "bot",
  icon,
  iconSize = 20,
  disabled = false,
  children,
  className = "",
  fullWidth = false,
  size = "md",
}) => {
  const base = "inline-flex items-center justify-center rounded font-medium transition duration-200 focus:outline-none";

  const sizes = {
    sm: "text-sm px-3 py-1.5",
    md: "text-base px-4 py-2",
    lg: "text-lg px-5 py-3",
  };
  ;

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 px-4 py-2",
    secondary: "bg-gray-300 text-black hover:bg-gray-400 px-4 py-2",
    danger: "bg-red-600 text-white hover:bg-red-700 px-4 py-2",
    outline: "border border-gray-500 text-gray-700 hover:bg-gray-100 px-4 py-2",
    disabled: "bg-gray-300 text-gray-500 cursor-not-allowed px-4 py-2",
    carousel: "bg-[rgba(var(--bookcard),1)] text-copy-primary shadow p-2 rounded-full hover:bg-gray-100",
    teal: "w-22 h-10 rounded-full bg-yellow-700 text-white hover:bg-yellow-800",
    pill: "inline-flex items-center justify-center px-6 py-2 text-white text-sm font-semibold rounded-full bg-[rgb(3,90,117)] hover:bg-[rgb(22,50,70)] transition-all shadow",
    borrow: "border border-teal-700 text-teal-700 font-semibold px-6 py-2 rounded-full hover:bg-teal-50 cursor-pointer transition-all",
    trash: "border border-red-600 text-red-600 font-semibold px-6 py-2 rounded-full hover:bg-red-50 cursor-pointer transition-all",
    read: "w-8 h-8 border border-indigo-700 text-indigo-700 font-semibold rounded-full hover:bg-red-50 cursor-pointer transition-all flex items-center justify-center",
    return: "bg-green-600 text-white font-semibold px-6 py-2 rounded-full hover:bg-green-700 cursor-pointer transition-all border border-green-700",
    bot: "inline-flex items-center justify-center px-6 py-2 bg-[rgb(3,90,117)] text-white text-sm font-semibold rounded-full hover:bg-[rgb(22,50,70)] transition-all shadow"


  };

  const style = `
    ${base}
    ${variant !== "pill" ? sizes[size] : ""}

    ${disabled ? variants.disabled : variants[variant] || variants.primary}
    ${fullWidth ? "w-full" : ""}
    ${className}
  `;

  const renderIcon = () => {
    if (!icon) return null;


    if (React.isValidElement(icon)) {
      return (
        <span className={`${!label && !children ? "mx-auto" : "inline-block mr-2"}`}>
          {icon}
        </span>
      );
    }

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
