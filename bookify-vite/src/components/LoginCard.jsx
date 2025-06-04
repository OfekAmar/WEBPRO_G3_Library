import React, { useState } from 'react';
import { db } from '../firebase';
import { ref, get } from 'firebase/database';

function LoginCard({ onClose, onLoginSuccess, onSwitchToRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

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
      onLoginSuccess?.(userData); // Notify parent
      onClose?.();
    }
  };

  return (
    <div className="absolute top-18 right-4 z-50">
      <div className="bg-gray-100 p-6 rounded-lg shadow-md w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl"
        >
          ✖
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center">🔐 Login</h2>
        <input
          type="text"
          placeholder="Email"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="bg-white w-full mb-3 p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="bg-white w-full mb-4 p-2 border rounded"
        />
        <button
          onClick={handleLogin}
          className="text-white py-2 rounded hover:bg-blue-700"
        >
          Log In
        </button>
        {msg && <p className="mt-2 text-sm text-red-500 text-center">{msg}</p>}

        <p className="text-sm mt-4 text-center">
          Don't have an account?{" "}
          <button
            onClick={onSwitchToRegister}
            className="text-black hover:underline"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}

export default LoginCard;
