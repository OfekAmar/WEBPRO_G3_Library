import React, { useState, useEffect, useRef } from 'react';
import { Eye, X } from 'lucide-react';
import { db } from '../firebase';
import { ref, get, set, update } from 'firebase/database';

function RegisterCard({ onClose, onRegisterSuccess, onSwitchToLogin }) {
  const popupRef = useRef();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });
  const [msg, setMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        onClose?.();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      if (!/^\d*$/.test(value)) return;
      if (value.length > 10) return;
      if (value.length >= 2 && !value.startsWith('05')) return;
    }

    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = async () => {
    const usersSnap = await get(ref(db, 'users'));
    const users = usersSnap.val() || [];

    for (let i = 1; i < users.length; i++) {
      if (users[i]?.email === form.email) {
        setMsg("Email already registered.");
        return;
      }
    }

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
    <div
      ref={popupRef}
      className="fixed top-16 right-6 bg-white shadow-xl rounded-lg p-4 w-80 z-50"
    >
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-bold">Sign Up</h2>
        <button onClick={onClose} className="text-gray-500 text-xl">
          <X size={20} />
        </button>
      </div>

      <input
        name="name"
        placeholder="Full Name"
        value={form.name}
        onChange={handleChange}
        className="bg-blue-100 w-full mb-3 p-2 border rounded"
      />
      <input
        name="email"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        className="bg-blue-100 w-full mb-3 p-2 border rounded"
      />
      <div className="relative mb-3">
        <input
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-2 rounded bg-red-100 pr-10 border"
        />
        <Eye
          size={18}
          className="absolute right-2 top-2.5 text-gray-500 cursor-pointer"
          onClick={() => setShowPassword(prev => !prev)}
        />
      </div>
      <input
        name="phone"
        placeholder="Phone (starts with 05)"
        value={form.phone}
        onChange={handleChange}
        className="bg-blue-100 w-full mb-4 p-2 border rounded"
      />

      <button
        onClick={handleRegister}
        className="bg-green-500 hover:bg-green-600 text-white w-full py-2 rounded mb-3"
      >
        Register
      </button>

      {msg && <p className="text-sm text-red-500 text-center">{msg}</p>}

      <p className="text-xs text-center text-gray-600 mt-2">
        Already have an account?{' '}
        <button onClick={onSwitchToLogin} className="text-blue-600 underline">
          Log in
        </button>
      </p>
    </div>
  );
}

export default RegisterCard;
