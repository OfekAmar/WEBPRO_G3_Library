{/*}
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
        <h2 className="text-2xl font-bold mb-6">User Profile </h2>
        {message && <p className="text-green-600 mb-4">{message}</p>}

        <div className="space-y-4">
          <ProfileRow label="Full Name" value={formData.name} editable={isEditing} onChange={handleChange} name="name" />
          <ProfileRow label="Email" value={formData.email} editable={isEditing} onChange={handleChange} name="email" />
          <ProfileRow label="Password" value={formData.password} editable={isEditing} onChange={handleChange} name="password" type="password" />
          <ProfileRow label="Phone" value={formData.phone} editable={isEditing} onChange={handleChange} name="phone" />

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-[rgb(207,230,238)] text-white px-4 py-2 rounded"
            >
              Edit Details
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
*/}



import React, { useEffect, useState } from "react";
import "/src/utils/userProfile.css";
import avatarImage from "/src/utils/user.png";
import { TbLockFilled } from "react-icons/tb";
import { IoSaveSharp } from "react-icons/io5";
import { BiCalendarEvent } from "react-icons/bi";
import Footer from "../components/Footer";
import { db } from "../firebase";
import { ref, get } from "firebase/database";

const UserProfile = ({ user }) => {
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const snap = await get(ref(db, "users/" + user.userIndex));
      const data = snap.val();
      if (data) {
        setUserData(data);
      }
    };
    fetchData();
  }, [user]);

  if (!user) return <p className="text-red-500">You must be logged in to view your profile.</p>;
  if (!userData) return <p className="text-gray-600">Loading user profile...</p>;

  return (
    <>
      <div className="view-host user-profile">
        <div className="view-wrapper">
          <div className="dx-toolbar">
            <button className="dx-button cancel-button" disabled={!isDirty}>Cancel</button>
            <button className="dx-button save-button dx-button-success" disabled={!isDirty}><IoSaveSharp />Save</button>
          </div>

          <div className="cards-container">
            <div className="basic-info-card card">
              <div className="basic-info-top-item d-flex">
                <div>
                  <div className="profile-card">
                    <img src={avatarImage} alt="User" className="form-photo" />
                    <div className="profile-info">
                      <span className="profile-name">{userData.first_name} {userData.last_name}</span>
                      <div className="name-line">
                        <span className="profile-id">ID: {user.userIndex}</span>
                      </div>
                      <div>
                        <button
                          className="dx-button change-password-button"
                          onClick={() => setPasswordModalOpen(true)}
                        >
                          <TbLockFilled /> Change Password
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-fields-grid two-cols">
                <Field label="First Name" value={userData.first_name} onChange={() => setIsDirty(true)} />
                <Field label="Last Name" value={userData.last_name} onChange={() => setIsDirty(true)} />
              </div>

              <div className="form-fields-grid four-cols">
                <Field label="Department" value={userData.Department} type="select" options={["Applied Mathematics", "Biotechnology Engineering", "Civil Engineering", "Electrical Engineering", "Industrial and Managment Engineering", "Mechanical Engineering", "Software Engineering"]} onChange={() => setIsDirty(true)} />
                <Field label="Position" value={userData.Position} type="select" options={["Student", "Lecturer"]} onChange={() => setIsDirty(true)} />
                <div className="input-with-icon">
                  <Field label="Birth Date" value={userData.birthDate || "1980-01-01"} type="date" onChange={() => setIsDirty(true)} />
                  <BiCalendarEvent className="date-icon" />
                </div>
              </div>

              <div className="contacts-card card">
                <h2>Contacts</h2>
                <div className="form-fields-grid">
                  <Field label="Phone" value={userData.phone} />
                  <Field label="Email" value={userData.email} />
                </div>
              </div>

              <div className="address-card card">
                <h2>Address</h2>
                <div className="form-fields-grid">
                  <Field label="City" value={userData.City} />
                  <Field label="Address" value={userData.Address} />
                </div>
              </div>
            </div>

            {isPasswordModalOpen && (
              <div className="modal-overlay">
                <div className="modal-window">
                  <h3 className="modal-title">Change Password</h3>
                  <form className="modal-form">
                    <label>Old Password:</label>
                    <input type="password" />

                    <label>New Password:</label>
                    <input type="password" />

                    <label>Confirm New Password:</label>
                    <input type="password" />

                    <div className="modal-actions">
                      <button type="button" className="modal-cancel" onClick={() => setPasswordModalOpen(false)}>Cancel</button>
                      <button type="submit" className="modal-save" disabled>Save</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

const Field = ({ label, value, type = "text", options = [], onChange, fullWidth = false }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={fullWidth ? "full-width" : ""}>
      <label>{label}:</label>
      {type === "select" ? (
        <div className={`select-wrapper ${isOpen ? "open" : ""}`}>
          <select
            className="dx-input"
            defaultValue={value}
            onMouseDown={() => setIsOpen(true)}
            onBlur={() => setIsOpen(false)}
            onChange={(e) => {
              onChange?.(e);
              setIsOpen(false);
            }}
          >
            {options.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      ) : (
        <input
          type={type}
          defaultValue={value}
          className="dx-input"
          onChange={onChange}
        />
      )}
    </div>
  );
};

export default UserProfile;
