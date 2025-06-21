

  import Button from './Button';

const SearchBar = ({ value, onSearch }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.(value.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-center w-full max-w-md mx-auto mb-6">
      <input
        type="text"
        value={value}
        onChange={(e) => onSearch?.(e.target.value)}
        placeholder="Search books..."
        className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <Button label="Search" variant="secondary" />
    </form>
  );
};

export default SearchBar;

