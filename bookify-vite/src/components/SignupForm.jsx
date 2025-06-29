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
    <div className="fixed top-16 right-6 bg-[rgba(var(--card),1)] text-copy-primary shadow-xl rounded-lg p-4 w-[90%] max-w-xl z-50 transition-colors">
      <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto bg-[rgba(var(--background),1)] p-6 rounded">
        <h2 className="text-2xl font-semibold text-center mb-6">Sign Up</h2>

        <div className="bg-[rgba(var(--background),1)] grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            name="first_name"
            placeholder="First Name *"
            value={formData.first_name}
            onChange={handleChange}
            className="border-b border-[rgba(var(--border),1)] py-2 focus:outline-none focus:border-[rgba(var(--cta),1)] bg-transparent text-[rgba(var(--copy-primary),1)]"
            required
          />
          <input
            name="last_name"
            placeholder="Last Name *"
            value={formData.last_name}
            onChange={handleChange}
            className="border-b border-[rgba(var(--border),1)] py-2 focus:outline-none focus:border-[rgba(var(--cta),1)] bg-transparent text-[rgba(var(--copy-primary),1)]"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email *"
            value={formData.email}
            onChange={handleChange}
            className="border-b border-[rgba(var(--border),1)] py-2 focus:outline-none focus:border-[rgba(var(--cta),1)] bg-transparent text-[rgba(var(--copy-primary),1)]"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password *"
            value={formData.password}
            onChange={handleChange}
            className="border-b border-[rgba(var(--border),1)] py-2 focus:outline-none focus:border-[rgba(var(--cta),1)] bg-transparent text-[rgba(var(--copy-primary),1)]"
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password *"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="border-b border-[rgba(var(--border),1)] py-2 focus:outline-none focus:border-[rgba(var(--cta),1)] bg-transparent text-[rgba(var(--copy-primary),1)]"
            required
          />
          <input
            name="phone"
            placeholder="Phone (starts with 05) *"
            value={formData.phone}
            onChange={handleChange}
            className="border-b border-[rgba(var(--border),1)] py-2 focus:outline-none focus:border-[rgba(var(--cta),1)] bg-transparent text-[rgba(var(--copy-primary),1)]"
            required
          />
          <input
            type="date"
            name="birthDate"
            placeholder="Birth Date *"
            value={formData.birthDate}
            onChange={handleChange}
            className="border-b border-[rgba(var(--border),1)] py-2 focus:outline-none focus:border-[rgba(var(--cta),1)] bg-transparent text-[rgba(var(--copy-primary),1)]"
            required
          />
          <select
            name="Department"
            value={formData.Department}
            onChange={handleChange}
            className="border-b border-[rgba(var(--border),1)] py-2 focus:outline-none focus:border-[rgba(var(--cta),1)] bg-transparent text-[rgba(var(--copy-primary),1)]"
            required
          >
            <option value="">Select Department</option>
            {departments.map(dep => <option key={dep} value={dep}>{dep}</option>)}
          </select>
          <select
            name="Position"
            value={formData.Position}
            onChange={handleChange}
            className="border-b border-[rgba(var(--border),1)] py-2 focus:outline-none focus:border-[rgba(var(--cta),1)] bg-transparent text-[rgba(var(--copy-primary),1)]"
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
            className="border-b border-[rgba(var(--border),1)] py-2 focus:outline-none focus:border-[rgba(var(--cta),1)] bg-transparent text-[rgba(var(--copy-primary),1)]"
            required
          />
          <input
            name="Address"
            placeholder="Address *"
            value={formData.Address}
            onChange={handleChange}
            className="border-b border-[rgba(var(--border),1)] py-2 focus:outline-none focus:border-[rgba(var(--cta),1)] bg-transparent text-[rgba(var(--copy-primary),1)]"
            required
          />
        </div>

        <p className="text-xs text-copy-secondary text-center mt-6 mb-4">
          By creating an account, you agree to the{' '}
          <a href="#" className="text-[rgba(var(--cta),1)] underline">Terms of Service</a> and{' '}
          <a href="#" className="text-[rgba(var(--cta),1)] underline">Privacy Policy</a>.
        </p>

        <button
          type="submit"
          className="w-full bg-[rgba(var(--cta),1)] text-[rgba(var(--cta-text),1)] py-2 rounded font-medium hover:opacity-90 transition"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Create a new account'}
        </button>

        <p className="text-sm text-center mt-4">
          Already have an account?{' '}
          <button type="button" onClick={() => { }} className="text-[rgba(var(--cta),1)] underline">
            Sign In
          </button>
        </p>
      </form>
    </div>
  );
};

export default SignupForm;
