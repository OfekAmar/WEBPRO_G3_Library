import React, { useEffect, useState } from 'react';
import { ref, get, update } from 'firebase/database';
import { db } from '../firebase';
import Button from '../components/Button';
import { Trash2, Bell, BellOff } from 'lucide-react';
import Footer from '../components/Footer';

function NotificationsPage({ user }) {
  const [notifications, setNotifications] = useState([]);
  const [allNotifications, setAllNotifications] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchNotifications = async () => {
      const snap = await get(ref(db, 'notifications'));
      const allNoti = snap.val() || {};
      const userNoti = Object.entries(allNoti)
        .filter(([key, val]) => val.user_id === user.user_id)
        .map(([key, val]) => ({ ...val, _key: key }))
        .sort((a, b) => new Date(b.time) - new Date(a.time));
      setAllNotifications(userNoti);
    };
    fetchNotifications();
  }, [user]);

  useEffect(() => {
    const filtered = showAll
      ? allNotifications
      : allNotifications.filter(n => !n.read);
    setNotifications(filtered);
  }, [showAll, allNotifications]);

  const toggleView = () => {
    setShowAll(prev => !prev);
  };

  const markAsRead = async (key) => {
    await update(ref(db, `notifications/${key}`), { read: true });
    setAllNotifications(prev =>
      prev.map(n => (n._key === key ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = async () => {
    const updates = {};
    allNotifications.forEach(n => {
      updates[`notifications/${n._key}/read`] = true;
    });
    await update(ref(db), updates);
    const updated = allNotifications.map(n => ({ ...n, read: true }));
    setAllNotifications(updated);
    setNotifications(showAll ? updated : updated.filter(n => !n.read));

  };

  const formatTime = (timeStr) => {
    const date = new Date(timeStr);
    return date.toLocaleString();
  };

  if (!user) {
    return <p className="p-6 text-red-500">You must be logged in to view your notifications.</p>;
  }

  return (
    <>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <Bell className="text-blue-600" size={28} /> Notifications
          </h2>
          <div className="flex gap-4">
            <button
              onClick={toggleView}
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              {showAll ? 'Show Unread Only' : 'See All'}
            </button>
            {notifications.length > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-red-600 hover:text-red-800 underline"
              >
                Read All
              </button>
            )}
          </div>
        </div>

        {notifications.length === 0 ? (
          <div className="text-center text-gray-600 mt-10">
            <BellOff className="mx-auto mb-2" size={40} />
            No notifications to show.
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification._key}
                onClick={() => markAsRead(notification._key)}
                className={`p-4 rounded-md shadow flex justify-between items-center cursor-pointer transition-opacity ${!notification.read ? 'bg-blue-50' : 'bg-gray-50'}`}
              >
                <div>
                  <p className={`text-sm ${!notification.read ? 'font-semibold text-blue-800' : 'text-gray-800'}`}>
                    {notification.content}
                  </p>
                  <p className="text-xs text-gray-500">{formatTime(notification.time)}</p>
                </div>
                <Button icon={Trash2} variant="trash" onClick={() => markAsRead(notification._key)} />
              </div>
            ))}
          </div>
        )}


      </div>
      <Footer />
    </>
  );
}

export default NotificationsPage;
