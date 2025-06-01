import React, { useState } from 'react';
import { db } from './firebase';
import { ref, get, set ,update} from 'firebase/database';

function RegisterPage({ onRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [msg, setMsg] = useState('');

  const handleRegister = async () => {
  if (!email || !password || !name || !phone) {
    setMsg("Please fill in all fields");
    return;
  }

  if (!/^05\d{8}$/.test(phone)) {
  setMsg("Phone number must start with 05 and be 10 digits long");
  return;
  } 
    
    const mgmtSnap = await get(ref(db, 'managment/users_index'));
    const newUserIndex = mgmtSnap.val() + 1;
    const usersRef = ref(db, 'users');
    const snapshot = await get(usersRef);
    const allUsers = snapshot.val() || {};

    const exists = Object.values(allUsers).some(user => user.email === email);
    if (exists) {
      setMsg("Email already registered");
      return;
    }

    const parsedId = parseInt(userId);
    if (isNaN(parsedId)) {
    setMsg("User ID must be a number");
    return;
    }
    const idTaken = Object.values(allUsers).some(u => u.user_id === parsedId);
    if (idTaken) {
    setMsg("User ID already in use");
    return;
    }

    await set(ref(db, 'users/' + newUserIndex),{
      email,
      password,
      user_id: parsedId,
      name,
      phone,
      role: 'user',
      notification_method: 'Email'
    });
    await update(ref(db, 'managment'), { users_index: newUserIndex });
    

    localStorage.setItem("loggedInUser", JSON.stringify({ username: email, user_id: parsedId, userIndex: newUserIndex }));
    setMsg("Account created!");
    onRegister({ username: email });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-4xl w-full bg-white shadow-xl rounded-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left side message */}
        <div className="bg-white p-8">
          <h2 className="text-2xl font-bold mb-2">Register📝</h2>
          <p className="text-gray-600">
            Create a free account to start borrowing books, build your reading list, and enjoy all the features of Bookify Library.
          </p>
        </div>

        {/* Right side form */}
        <div className="p-8 border-l">
          <h3 className="text-xl font-semibold mb-6">Create Account</h3>
          
            <div className="space-y-4 flex flex-col">
                <input
                      type="text"
                      placeholder="User ID (9 digits)"
                      value={userId}
                      onChange={e => {
                        const value = e.target.value;
                        if (/^\d{0,9}$/.test(value)) setUserId(value);
                      }}
                      className="w-full border rounded px-3 py-2"
                />
                <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                />
                <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                />
                <input
                      type="text"
                      placeholder="05*-*******"
                      value={phone}
                      onChange={e => {
                        const value = e.target.value;
                        if (/^0?$|^05\d{0,8}$/.test(value)) {
                          setPhone(value);
                        }
                      }}
                      className="w-full border rounded px-3 py-2"

                />
                <input
                      type="password"
                      placeholder="Password (max 20 chars)"
                      value={password}
                      onChange={e => {
                        const value = e.target.value;
                        if (value.length <= 20) {
                          setPassword(value);
                        }
                      }}
                      className="w-full border rounded px-3 py-2"
                />
            
            <button
              onClick={handleRegister}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              Sign Up
            </button>
            {msg && <p className="text-sm text-red-500">{msg}</p>}
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Already have an account? <span className="text-blue-600 underline cursor-default">Log in</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
