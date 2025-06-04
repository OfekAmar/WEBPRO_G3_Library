import React, { useState } from 'react';
import LoginCard from './LoginCard';
import RegisterCard from './RegisterCard';

function Modal({ open, onClose, defaultView = 'login' }) {
  const [view, setView] = useState(defaultView);

  if (!open) return null;

  const handleSwitch = () => {
    setView(prev => (prev === 'login' ? 'signup' : 'login'));
  };

  const commonProps = {
    onClose,
    onSwitchToLogin: () => setView('login'),
    onSwitchToRegister: () => setView('signup'),
    onRegisterSuccess: () => setView('login')
  };

  return view === 'login'
    ? <LoginCard {...commonProps} />
    : <RegisterCard {...commonProps} />;
}

export default Modal;
