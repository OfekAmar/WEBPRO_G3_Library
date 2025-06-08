import React from 'react';
import Header from '../components/Header';

const Layout = ({ user, onLogout, onLoginClick, children }) => {
  return (
    <div>
      <Header user={user} onLogout={onLogout} onLoginClick={onLoginClick} />
      <main className="pt-18 min-h-screen">{children}</main>
    </div>
  );
};

export default Layout;