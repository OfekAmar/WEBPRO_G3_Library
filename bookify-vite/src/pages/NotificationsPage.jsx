import React, { useEffect, useState } from 'react';
import { ref, get, update } from 'firebase/database';
import { db } from '../firebase';
import Button from '../components/Button';
import { Trash2, Bell, BellOff , Check} from 'lucide-react';

function NotificationsPage({ user }) {
  const [notifications, setNotifications] = useState([]);
  const [allNotifications, setAllNotifications] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (!user) return;
    // Fetch user's notifications from Firebase and sort by time
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

  // Toggle between showing all notifications and only unread ones
  const toggleView = () => {
    setShowAll(prev => !prev);
  };

  // Mark a single notification as read
  const markAsRead = async (key) => {
    await update(ref(db, `notifications/${key}`), { read: true });
    setAllNotifications(prev =>
      prev.map(n => (n._key === key ? { ...n, read: true } : n))
    );
  };

  // Mark all notifications as read
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
      <div className="pt-16 p-6 max-w-4xl mx-auto text-copy-primary">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold flex items-center gap-2">
            Notifications
          </h2>
          <div className="flex gap-4">
            <button
              onClick={toggleView}
              className="text-sm text-cta hover:text-cta-active underline"
            >
              {showAll ? 'Show Unread Only' : 'See All'}
            </button>
            {notifications.length > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-cta hover:text-cta-active underline"
              >
                Read All
              </button>
            )}
          </div>
        </div>

        {notifications.length === 0 ? (
          <div className="text-center text-copy-secondary mt-10">
            <BellOff className="mx-auto mb-2" size={40} />
            No notifications to show.
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification._key}
                onClick={() => markAsRead(notification._key)}
                className={`p-4 rounded-md shadow flex justify-between items-center cursor-pointer transition-opacity 
                  ${!notification.read ? 'bg-[rgba(191,219,254,0.2)]' : 'bg-card border border-border'}`}
              >
                <div>
                  <p className={`text-sm ${!notification.read ? 'font-semibold text-cta' : 'text-copy-primary'}`}>
                    {notification.content}
                  </p>
                  <p className="text-xs text-copy-secondary">{formatTime(notification.time)}</p>
                </div>
                <Button icon={<Check size={16} />} iconSize={16} variant="read" onClick={() => markAsRead(notification._key)} />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default NotificationsPage;