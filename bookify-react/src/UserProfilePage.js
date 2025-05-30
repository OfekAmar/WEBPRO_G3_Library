import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { ref, get } from 'firebase/database';

function UserProfilePage() {
  const [user, setUser] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("loggedInUser");
    if (!stored) return;

    const parsed = JSON.parse(stored);
    setUser(parsed);

    const fetchData = async () => {
      const snap = await get(ref(db, 'users/' + parsed.username));
      setData(snap.val());
    };

    fetchData();
  }, []);

  if (!user) return <p className="text-red-500">You must be logged in to view your profile.</p>;

  if (!data) return <p className="text-gray-600">Loading user profile...</p>;

  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">👤 User Profile</h2>
      <div className="space-y-2 text-lg">
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Full Name:</strong> {data.name}</p>
        <p><strong>Email:</strong> {data.email}</p>
        <p><strong>Phone:</strong> {data.phone}</p>
      </div>
    </div>
  );
}

export default UserProfilePage;
