import React, { useState, useEffect, useRef } from 'react';
import { Eye, X } from 'lucide-react';
import { db } from '../firebase';
import { ref, get } from 'firebase/database';

function LoginCard({ onClose, onLoginSuccess, onSwitchToRegister }) {
  const popupRef = useRef();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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

  const handleLogin = async () => {
    const usersRef = ref(db, 'users');
    const snapshot = await get(usersRef);
    const allUsers = snapshot.val();

    let matchedUser = null;
    for (let i = 1; i < allUsers.length; i++) {
      const user = allUsers[i];
      if (!user) continue;
      if (user.email === username && user.password === password) {
        matchedUser = user;
        matchedUser.index = i;
        break;
      }
    }

    if (!matchedUser) {
      setMsg("Incorrect email or password");
    } else {
      const userData = {
        username: matchedUser.email,
        user_id: matchedUser.user_id,
        userIndex: matchedUser.index,
        name: matchedUser.name
      };
      localStorage.setItem("loggedInUser", JSON.stringify(userData));
      setMsg("Login successful!");
      onLoginSuccess?.(userData);
      onClose?.();
    }
  };

  return (
    <div
      ref={popupRef}
      className="fixed top-16 right-6 bg-white shadow-xl rounded-lg p-4 w-80 z-50"
    >
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-bold">Log in / Register</h2>
        <button onClick={onClose} className="text-gray-500 text-xl">
          <X size={20} />
        </button>
      </div>

      <label className="block text-sm font-semibold mb-1">Email</label>
      <input
        type="text"
        value={username}
        onChange={e => setUsername(e.target.value)}
        className="w-full p-2 rounded bg-blue-100 mb-3"
        placeholder="example@mail.com"
      />

      <label className="block text-sm font-semibold mb-1">Password</label>
      <div className="relative mb-3">
        <input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full p-2 rounded bg-red-100 pr-10"
          placeholder="Enter password"
        />
        <Eye
          size={18}
          className="absolute right-2 top-2.5 text-gray-500 cursor-pointer"
          onClick={() => setShowPassword(prev => !prev)}
        />
      </div>

      <label className="flex items-center text-sm mb-3">
        <input type="checkbox" className="mr-2" /> Stay logged in
      </label>

      <button
        onClick={handleLogin}
        className="bg-green-500 hover:bg-green-600 text-white w-full py-2 rounded mb-3"
      >
        Login
      </button>

      {msg && <p className="text-sm text-red-500 text-center">{msg}</p>}

      <p className="text-xs text-center text-gray-600 mt-2">
        Don't have an account?{' '}
        <button onClick={onSwitchToRegister} className="text-blue-600 underline">
          Sign up now.
        </button>
      </p>
    </div>
  );
}

export default LoginCard;
