
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