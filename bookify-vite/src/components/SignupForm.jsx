{/* eslint-disable react/prop-types 
import { useState } from 'react';
import Button from './Button';

const SignupForm = ({ onSubmit, loading }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    onSubmit?.({ name, email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-center">Register</h2>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>

      <Button
        label={loading ? "Registering..." : "Register"}
        variant="primary"
        disabled={loading}
      />
    </form>
  );
};

export default SignupForm;
*/}

import { useState } from 'react';

const SignupForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    Department: '',
    Position: '',
    City: '',
    Address: '',
    birthDate: '',
  });

  const departments = [
    "Applied Mathematics",
    "Biotechnology Engineering",
    "Civil Engineering",
    "Electrical Engineering",
    "Industrial and Managment Engineering",
    "Mechanical Engineering",
    "Software Engineering",
  ];

  const positions = ["Student", "Lecturer"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const allFieldsFilled = Object.values(formData).every(val => val.trim() !== '');
    if (!allFieldsFilled) return;
    if (formData.password !== formData.confirmPassword) return;
    onSubmit?.(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto bg-white p-6 rounded">
      <h2 className="text-2xl font-semibold text-center mb-6">Sign Up</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          name="first_name"
          placeholder="First Name *"
          value={formData.first_name}
          onChange={handleChange}
          className="border-b border-gray-300 py-2 focus:outline-none focus:border-blue-500"
          required
        />
        <input
          name="last_name"
          placeholder="Last Name *"
          value={formData.last_name}
          onChange={handleChange}
          className="border-b border-gray-300 py-2 focus:outline-none focus:border-blue-500"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email *"
          value={formData.email}
          onChange={handleChange}
          className="border-b border-gray-300 py-2 focus:outline-none focus:border-blue-500"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password *"
          value={formData.password}
          onChange={handleChange}
          className="border-b border-gray-300 py-2 focus:outline-none focus:border-blue-500"
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password *"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="border-b border-gray-300 py-2 focus:outline-none focus:border-blue-500"
          required
        />
        <input
          name="phone"
          placeholder="Phone (starts with 05) *"
          value={formData.phone}
          onChange={handleChange}
          className="border-b border-gray-300 py-2 focus:outline-none focus:border-blue-500"
          required
        />
        <input
          type="date"
          name="birthDate"
          placeholder="Birth Date *"
          value={formData.birthDate}
          onChange={handleChange}
          className="border-b border-gray-300 py-2 focus:outline-none focus:border-blue-500"
          required
        />
        <select
          name="Department"
          value={formData.Department}
          onChange={handleChange}
          className="border-b border-gray-300 py-2 focus:outline-none focus:border-blue-500"
          required
        >
          <option value="">Select Department</option>
          {departments.map(dep => <option key={dep} value={dep}>{dep}</option>)}
        </select>
        <select
          name="Position"
          value={formData.Position}
          onChange={handleChange}
          className="border-b border-gray-300 py-2 focus:outline-none focus:border-blue-500"
          required
        >
          <option value="">Select Position</option>
          {positions.map(pos => <option key={pos} value={pos}>{pos}</option>)}
        </select>
        <input
          name="City"
          placeholder="City *"
          value={formData.City}
          onChange={handleChange}
          className="border-b border-gray-300 py-2 focus:outline-none focus:border-blue-500"
          required
        />
        <input
          name="Address"
          placeholder="Address *"
          value={formData.Address}
          onChange={handleChange}
          className="border-b border-gray-300 py-2 focus:outline-none focus:border-blue-500"
          required
        />
      </div>

      <p className="text-xs text-gray-500 text-center mt-6 mb-4">
        By creating an account, you agree to the{' '}
        <a href="#" className="text-blue-600 underline">Terms of Service</a> and{' '}
        <a href="#" className="text-blue-600 underline">Privacy Policy</a>.
      </p>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded font-medium hover:bg-blue-600 transition"
        disabled={loading}
      >
        {loading ? 'Registering...' : 'Create a new account'}
      </button>

      <p className="text-sm text-center mt-4">
        Already have an account?{' '}
        <button type="button" onClick={() => {}} className="text-blue-600 underline">
          Sign In
        </button>
      </p>
    </form>
  );
};

export default SignupForm;

