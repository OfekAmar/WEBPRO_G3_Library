import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { ref, get, update } from 'firebase/database';

function UserProfilePage() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem("loggedInUser");
    if (!stored) return;

    const parsed = JSON.parse(stored);
    setUser(parsed);

    const fetchData = async () => {
      const snap = await get(ref(db, 'users/' + parsed.userIndex));
      const data = snap.val();
      if (data) {
        setFormData({
          name: data.name || '',
          email: data.email || '',
          password: data.password || '',
          phone: data.phone || '',
        });
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
  const { name, value } = e.target;

  // במקרה של טלפון – נוודא שמתחיל ב־05, עד 10 ספרות, ורק מספרים
  if (name === 'phone') {
    if (!/^\d*$/.test(value)) return; // רק ספרות
    if (value.length > 10) return;    // עד 10 תווים
    if (value.length >= 1 && !value.startsWith('05')) return; // חובה להתחיל ב־05
  }

  setFormData(prev => ({
    ...prev,
    [name]: value
  }));
};

  const handleSave = async () => {
    if (!user) return;

    await update(ref(db, 'users/' + user.userIndex), {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone
    });

    setMessage('✅ Profile updated successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  if (!user) return <p className="text-red-500">You must be logged in to view your profile.</p>;

  // הצגת הודעת טעינה אם אין עדיין נתונים בטופס
  if (!formData.name && !formData.email && !formData.password && !formData.phone) {
    return <p className="text-gray-600">Loading user profile...</p>;
  }

  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-6"> Edit Profile👤</h2>

      {message && <p className="text-green-600 mb-6">{message}</p>}
      
      <div className="space-y-8">
        <div>
          <label className="block font-medium">Full Name:</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border px-4 py-3 rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Email:</label>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Password:</label>
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Phone:</label>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            maxLength={10}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <button
          onClick={handleSave}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          💾 Save Changes
        </button>
      </div>
    </div>
  );
}

export default UserProfilePage;
