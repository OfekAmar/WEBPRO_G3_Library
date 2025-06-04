import { useState } from 'react';
import Button from './Button';

const LoginForm = ({ onSubmit, loading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    onSubmit?.({ email, password });
  };

  return (
    <div className="absolute top-20 left-6 z-50">
      <form
        onSubmit={handleSubmit}
        className="w-80 bg-white p-5 rounded-lg shadow-lg border border-gray-200"
      >
        <h2 className="text-xl font-bold mb-4 text-center">Login</h2>

        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <Button
          label={loading ? 'Logging in...' : 'Login'}
          variant="primary"
          disabled={loading}
          className="w-full"
        />
      </form>
    </div>
  );
};

export default LoginForm;
