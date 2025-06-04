// src/components/NotificationCard.jsx
const NotificationCard = ({ notification, onDelete }) => {
  const { noti_id, time, type, content } = notification;

  return (
    <div
      id={`notif-${noti_id}`}
      className="bg-white border rounded shadow p-4 relative transition-opacity duration-300"
    >
      <button
        onClick={() => {
          if (window.confirm("Are you sure you want to delete this notification?")) {
            onDelete(noti_id);
          }
        }}
        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
        title="Delete notification"
      >
        ❌
      </button>
      <p className="text-sm text-gray-400">{new Date(time).toLocaleString()}</p>
      <p className="font-semibold text-blue-600">{type}</p>
      <p className="mt-1">{content}</p>
    </div>
  );
};

export default NotificationCard;
