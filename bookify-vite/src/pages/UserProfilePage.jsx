import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { ref, get, update } from 'firebase/database';

function UserProfilePage({ user }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });
  const [message, setMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState({});

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const snap = await get(ref(db, 'users/' + user.userIndex));
      const data = snap.val();
      if (data) {
        setFormData({
          name: data.name || '',
          email: data.email || '',
          password: data.password || '',
          phone: data.phone || '',
        });
        setOriginalData(data); // store original in case of cancel
      }
    };
    fetchData();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      if (!/^\d*$/.test(value)) return;
      if (value.length > 10) return;
      if (value.length >= 1 && !value.startsWith('05')) return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!user) return;

    await update(ref(db, 'users/' + user.userIndex), formData);
    setMessage('✅ Profile updated successfully!');
    setIsEditing(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleCancel = () => {
    setFormData(originalData);
    setIsEditing(false);
  };

  if (!user) return <p className="text-red-500">You must be logged in to view your profile.</p>;

  if (!formData.name && !formData.email && !formData.password && !formData.phone) {
    return <p className="text-gray-600">Loading user profile...</p>;
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6">User Profile 👤</h2>
        {message && <p className="text-green-600 mb-4">{message}</p>}

        <div className="space-y-4">
          <ProfileRow label="Full Name" value={formData.name} editable={isEditing} onChange={handleChange} name="name" />
          <ProfileRow label="Email" value={formData.email} editable={isEditing} onChange={handleChange} name="email" />
          <ProfileRow label="Password" value={formData.password} editable={isEditing} onChange={handleChange} name="password" type="password" />
          <ProfileRow label="Phone" value={formData.phone} editable={isEditing} onChange={handleChange} name="phone" />

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              ✏️ Edit Details
            </button>
          ) : (
            <div className="flex gap-4">
              <button
                onClick={handleSave}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                💾 Save
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                ❌ Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Reusable row component
const ProfileRow = ({ label, value, editable, onChange, name, type = "text" }) => (
  <div>
    <label className="block font-medium mb-1">{label}:</label>
    {editable ? (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border px-3 py-2 rounded"
      />
    ) : (
      <p className="bg-gray-100 px-3 py-2 rounded text-gray-700">{value || '—'}</p>
    )}
  </div>
);

export default UserProfilePage;
