const NotificationList = ({ notifications = [] }) => {
  if (notifications.length === 0) {
    return <p className="text-gray-500 text-center mt-6">No notifications.</p>;
  }

  return (
    <div className="max-w-xl mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Notifications</h2>
      <ul className="space-y-3">
        {notifications.map((n, index) => (
          <li
            key={index}
            className="border p-3 rounded bg-gray-50 hover:bg-gray-100 transition"
          >
            <p className="text-sm text-gray-800">{n.message}</p>
            <p className="text-xs text-gray-400 mt-1">{formatTimestamp(n.time)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Helper (you can extract this to a utils file)
const formatTimestamp = (ts) => {
  const date = new Date(ts);
  return date.toLocaleString();
};

export default NotificationList;
