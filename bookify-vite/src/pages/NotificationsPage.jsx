import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { ref, get, remove } from 'firebase/database';
import Layout from '../Layout/Layout';
import Button from '../components/Button';
import NotificationCard from '../components/NotificationCard';

function NotificationsPage({ user }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      const snap = await get(ref(db, 'notifications'));
      const all = snap.val() || {};

      const userNotifs = Object.values(all)
        .filter(n => n.user_index === user.userIndex)
        .sort((a, b) => new Date(b.time) - new Date(a.time));

      setNotifications(userNotifs);
    };

    fetchNotifications();
  }, [user]);

  const handleDelete = async (noti_id) => {
    const element = document.getElementById(`notif-${noti_id}`);
    if (element) {
      element.classList.add("opacity-0", "transition-opacity", "duration-300");
    }

    setTimeout(async () => {
      await remove(ref(db, `notifications/${noti_id}`));
      setNotifications(prev => prev.filter(n => n.noti_id !== noti_id));
    }, 300);
  };

  const handleClearAll = async () => {
    if (!window.confirm("Are you sure you want to delete ALL your notifications?")) return;

    const deletes = notifications.map(n =>
      remove(ref(db, `notifications/${n.noti_id}`))
    );
    await Promise.all(deletes);
    setNotifications([]);
  };

  if (!user) {
    return <p className="p-6 text-red-500">You must be logged in to view your notifications.</p>;
  }

  return (

      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Notifications 🔔</h2>

        {notifications.length === 0 ? (
          <p className="text-gray-600">No notifications yet.</p>
        ) : (
          <>
            <Button
              label="Clear All Notifications 🧹"
              variant="danger"
              onClick={handleClearAll}
              className="mb-4"
            />
            <div className="space-y-4">
              {notifications.map((n) => (
                <NotificationCard key={n.noti_id} notification={n} onDelete={handleDelete} />
              ))}
            </div>
          </>
        )}
      </div>

  );
}

export default NotificationsPage;
