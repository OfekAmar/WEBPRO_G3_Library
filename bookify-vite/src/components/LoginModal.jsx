import { useState } from 'react';
import LoginCard from './LoginCard';
import SignupCard from './RegisterCard';

const LoginModal = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState('login'); // 'login' or 'signup'

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md relative"
        onClick={(e) => e.stopPropagation()} // prevent modal close on card click
      >
        {mode === 'login' ? (
          <LoginCard onSwitch={() => setMode('signup')} onClose={onClose} />
        ) : (
          <SignupCard onSwitch={() => setMode('login')} onClose={onClose} />
        )}
      </div>
    </div>
  );
};

export default LoginModal;
