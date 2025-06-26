import React, { useEffect, useState } from 'react';
import { get, ref, remove } from 'firebase/database';
import { db } from '../firebase';
import SearchBar from '../components/SearchBar';
import AdminUserCard from '../components/AdminUserCard';
import RegisterCard from '../components/RegisterCard';
import Button from '../components/Button';

function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState('');
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    const load = async () => {
      const snap = await get(ref(db, 'users'));
      const list = Object.values(snap.val() || {});
      setUsers(list);
    };
    load();
  }, [showRegister]); // re-fetch when register is closed
  const handleDeleteUser = async (user) => {
  await remove(ref(db, `users/${user.userIndex || user.user_id}`));
  setUsers(prev => prev.filter(u => u.user_id !== user.user_id));
    };

  const filtered = users.filter((u) =>
    u.first_name?.toLowerCase().includes(query.toLowerCase()) ||
    u.last_name?.toLowerCase().includes(query.toLowerCase()) ||
    u.Department?.toLowerCase().includes(query.toLowerCase()) ||
    String(u.user_id).includes(query)
  );

  return (
    <div className="p-6 max-w-4xl mx-auto text-copy-primary">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">👥 Manage Users</h2>
        <Button label="Add User" onClick={() => setShowRegister(true)} variant="teal" />
      </div>

      <SearchBar value={query} onSearch={setQuery} />

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
