

{/*
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
*/}

const NotifyButton = ({ isInNotifyList, onToggle }) => {
  return (
    <span
      onClick={onToggle}
      type="button"
      title={isInNotifyList ? 'Remove from Notify List' : 'Notify Me When Available'}
      className={`
        w-10 h-10 rounded-full flex items-center justify-center
        border border-gray-300 text-gray-600 hover:bg-gray-100
        transition duration-200 cursor-pointer
        ${isInNotifyList ? 'text-yellow-500' : ''}
      `}
    >
      <i className="fa-solid fa-bell"></i>
    </span>
  );
};

export default NotifyButton;