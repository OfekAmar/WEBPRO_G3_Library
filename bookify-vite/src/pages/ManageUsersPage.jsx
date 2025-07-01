import React, { useEffect, useState } from 'react';
import { get, ref, remove } from 'firebase/database';
import { db } from '../firebase';
import UserSearchBar from '../components/UserSearchBar';
import AdminUserCard from '../components/AdminUserCard';
import RegisterCard from '../components/RegisterCard';
import Buttonn from '../components/Button';

function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState('');
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    // Load users data from Firebase and update state
    const load = async () => {
      const snap = await get(ref(db, 'users'));
      const list = Object.values(snap.val() || {});
      setUsers(list);
    };
    load();
  }, [showRegister]); // re-fetch when register is closed

  // Delete user from Firebase and update local state
  const handleDeleteUser = async (user) => {
    await remove(ref(db, `users/${user.userIndex || user.user_id}`));
    setUsers(prev => prev.filter(u => u.user_id !== user.user_id));
  };

  // Filter users based on search query (first name, last name, department, or ID)
  const filtered = users.filter((u) =>
    u.first_name?.toLowerCase().includes(query.toLowerCase()) ||
    u.last_name?.toLowerCase().includes(query.toLowerCase()) ||
    u.Department?.toLowerCase().includes(query.toLowerCase()) ||
    String(u.user_id).includes(query)
  );

  return (
    <div className="pt-16 p-6 max-w-4xl mx-auto text-copy-primary">
      <div className="flex flex-wrap justify-between items-baseline gap-4 mb-4">
        <h2 className="text-2xl font-bold">Manage Users</h2>
        <UserSearchBar value={query} onSearch={setQuery} className="w-72" />
        <Buttonn label="Add User" onClick={() => setShowRegister(true)} variant="default" />
      </div>

      <div className="grid gap-4">
        {filtered.map((user, i) => (
          <AdminUserCard key={i} user={user} onDelete={handleDeleteUser} />
        ))}
      </div>

      {showRegister && (
        <RegisterCard
          onClose={() => setShowRegister(false)}
          onSwitchToLogin={() => setShowRegister(false)}
        />
      )}
    </div>

  );
}

export default ManageUsersPage;
