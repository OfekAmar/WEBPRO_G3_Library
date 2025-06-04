import React, { useState } from 'react';
import { db } from '../firebase';
import { ref, get, set, update } from 'firebase/database';

function RegisterCard({ onClose, onRegisterSuccess, onSwitchToLogin }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });
  const [msg, setMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validate phone (only digits, starts with 05, max 10)
   if (name === 'phone') {
        if (!/^\d*$/.test(value)) return; // only digits
        if (value.length > 10) return;    // max 10
        if (value.length >= 2 && !value.startsWith('05')) return; // must start with '05' after 2 digits
    }

    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = async () => {
    const usersSnap = await get(ref(db, 'users'));
    const users = usersSnap.val() || [];

    // Check for existing email
    for (let i = 1; i < users.length; i++) {
      if (users[i]?.email === form.email) {
        setMsg("Email already registered.");
        return;
      }
    }

    // Get next user_id and userIndex
    const mgmtSnap = await get(ref(db, 'managment'));
    const userIndex = mgmtSnap.val().users_index + 1;

    const newUser = {
      name: form.name,
      email: form.email,
      password: form.password,
      phone: form.phone,
      user_id: userIndex
    };

    await set(ref(db, `users/${userIndex}`), newUser);
    await update(ref(db, 'managment'), { users_index: userIndex });

    localStorage.setItem("loggedInUser", JSON.stringify({
      username: newUser.email,
      user_id: newUser.user_id,
      userIndex,
      name: newUser.name
    }));

    onRegisterSuccess?.(newUser);
    onClose?.();
  };

  return (
    <div className="absolute top-16 right-4 z-50">
      <div className="bg-gray-100 p-6 rounded-lg shadow-md w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl"
        >
          ✖
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center">📝 Register</h2>

        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="bg-white w-full mb-3 p-2 border rounded"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="bg-white w-full mb-3 p-2 border rounded"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="bg-white w-full mb-3 p-2 border rounded"
        />
        <input
          name="phone"
          placeholder="Phone (starts with 05)"
          value={form.phone}
          onChange={handleChange}
          className="bg-white w-full mb-4 p-2 border rounded"
        />

        <button
          onClick={handleRegister}
          className="bg-green-600 text-white py-2 rounded hover:bg-green-700 block mx-auto"
        >
          Sign Up
        </button>

        {msg && <p className="mt-2 text-sm text-red-500 text-center">{msg}</p>}

        <p className="text-sm mt-4 text-center">
          Already have an account?{" "}
          <button
            onClick={onSwitchToLogin}
            className="text-black hover:underline"
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
}

export default RegisterCard;
