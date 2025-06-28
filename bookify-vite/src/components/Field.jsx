import { useState } from 'react';

const Field = ({ label, value, type = "text", options = [], onChange, fullWidth = false }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={fullWidth ? "full-width" : ""}>
      <label>{label}:</label>
      {type === "select" ? (
        <div className={`select-wrapper ${isOpen ? "open" : ""}`}>
          <select
            className="dx-input"
            defaultValue={value}
            onMouseDown={() => setIsOpen(true)}
            onBlur={() => setIsOpen(false)}
            onChange={(e) => {
              onChange?.(e);
              setIsOpen(false);
            }}
          >
            {options.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      ) : (
        <input
          type={type}
          value={value}
          className={`dx-input ${type === "date" ? "date-input" : ""}`}
          onChange={onChange}
        />
      )}
    </div>
  );
};

export default Field;
