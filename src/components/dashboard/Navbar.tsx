import React from 'react';
import { useAuth } from '../../context/AuthContext';
import '../../styles/navbar.css';

const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">

      {/* Logo */}
      <a href="/dashboard" className="navbar__logo">
        Read<span>deck</span>
      </a>

      {/* Location */}
      <div className="navbar__center">
        <svg className="navbar__location-icon" fill="none"
          viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827
            0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="navbar__location-text">
          Set delivery location
        </span>
        <svg width="12" height="12" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Right */}
      <div className="navbar__right">
        <p className="navbar__greeting">
          {getGreeting()},{' '}
          <span>{user?.username}</span> 👋
        </p>
        <div className="navbar__avatar">
          {user?.username?.charAt(0).toUpperCase()}
        </div>
        <button className="navbar__signout" onClick={logout}>
          Sign out
        </button>
      </div>

    </nav>
  );
};

export default Navbar;