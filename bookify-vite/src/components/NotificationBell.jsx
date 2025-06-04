import { Bell } from 'lucide-react'; // or any other icon lib

const NotificationBell = ({ count = 0, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="relative p-2 hover:bg-gray-100 rounded-full transition"
    >
      <Bell className="w-6 h-6 text-gray-700" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full px-1.5">
          {count}
        </span>
      )}
    </button>
  );
};

export default NotificationBell;
