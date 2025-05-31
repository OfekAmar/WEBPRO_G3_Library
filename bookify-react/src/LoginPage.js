import React, { useState } from 'react';
import { db } from './firebase';
import { ref, get } from 'firebase/database';

function LoginPage({ onLogin }) {
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
     localStorage.setItem("loggedInUser", JSON.stringify({
        username: matchedUser.email,
        user_id: matchedUser.user_id,
        userIndex: matchedUser.index,
        name: matchedUser.name
        }));
      setMsg("Login successful!");
      onLogin({ username: matchedUser.email });
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">🔐 Login</h2>
      <input
        type="text"
        placeholder="Email"
        value={username}
        onChange={e => setUsername(e.target.value)}
        className="w-full mb-2 p-2 border rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="w-full mb-4 p-2 border rounded"
      />
      <button
        onClick={handleLogin}
        className="w-full bg-blue-600 text-white py-2 rounded"
      >
        Log In
      </button>
      {msg && <p className="mt-2 text-sm text-red-500">{msg}</p>}
    </div>
  );
}

export default LoginPage;
