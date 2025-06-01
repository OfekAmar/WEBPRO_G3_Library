import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { ref, get, remove } from 'firebase/database';

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [user, setUser] = useState(null);
  const handleDelete = async (noti_id) => {
  const element = document.getElementById(`notif-${noti_id}`);
  if (element) {
    element.classList.add("opacity-0", "transition-opacity", "duration-300");
  }
  setTimeout(async () => {
    await remove(ref(db, 'notifications/' + noti_id));
    setNotifications(prev => prev.filter(n => n.noti_id !== noti_id));
  }, 300);
};
  const handleClearAll = async () => {
  if (!window.confirm("Are you sure you want to delete ALL your notifications?")) return;

  const updates = {};
  notifications.forEach(n => {
    updates[`notifications/${n.noti_id}`] = null;
  });

  await Promise.all(
    Object.keys(updates).map(path => remove(ref(db, path)))
  );

  setNotifications([]);
};

  useEffect(() => {
    const stored = localStorage.getItem('loggedInUser');
    if (!stored) return;

    const parsed = JSON.parse(stored);
    setUser(parsed);

    const fetchNotifications = async () => {
      const snap = await get(ref(db, 'notifications'));
      const all = snap.val() || {};

      const userNotifs = Object.values(all)
        .filter(n => n.user_index === parsed.userIndex)
        .sort((a, b) => new Date(b.time) - new Date(a.time)); // newest first

      setNotifications(userNotifs);
    };

    fetchNotifications();
  }, []);

  if (!user) {
    return <p className="p-6 text-red-500">You must be logged in to view your notifications.</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4"> Notifications🔔</h2>

      {notifications.length === 0 ? (
        <p className="text-gray-600">No notifications yet.</p>
      ) : (
        <>
        <button
          onClick={handleClearAll}
          className="mb-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
           Clear All Notifications🧹
        </button>

        <div className="space-y-4">
          {notifications.map((n) => (
            <div id={`notif-${n.noti_id}`} key={n.noti_id} className="bg-white border rounded shadow p-4 relative">
              <button
                onClick={() => {
                  if (window.confirm("Are you sure you want to delete this notification?")) {
                    handleDelete(n.noti_id);
                  }
               }}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                title="Delete notification"
              >
                ❌
              </button>
              <p className="text-sm text-gray-400">{new Date(n.time).toLocaleString()}</p>
              <p className="font-semibold text-blue-600">{n.type}</p>
              <p className="mt-1">{n.content}</p>
            </div>
          ))}
        </div>
      </>
      )}
    </div>
);
}

export default NotificationsPage;
