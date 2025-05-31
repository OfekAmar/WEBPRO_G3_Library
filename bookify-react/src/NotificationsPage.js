import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { ref, get } from 'firebase/database';

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [user, setUser] = useState(null);

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
      <h2 className="text-2xl font-bold mb-4">🔔 Notifications</h2>

      {notifications.length === 0 ? (
        <p className="text-gray-600">No notifications yet.</p>
      ) : (
        <div className="space-y-4">
          {notifications.map((n, i) => (
            <div key={i} className="bg-white border rounded shadow p-4">
              <p className="text-sm text-gray-400">{new Date(n.time).toLocaleString()}</p>
              <p className="font-semibold text-blue-600">{n.type}</p>
              <p className="mt-1">{n.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NotificationsPage;
