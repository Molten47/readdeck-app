import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavbar } from './useNavbar';
import './navbar.css';

const Navbar: React.FC = () => {
  const {
    isScrolled,
    dropdownOpen, setDropdownOpen,
    avatarMenuOpen, setAvatarMenuOpen,
    dropdownRef, avatarRef,
    user, handleLogout,
    isDark, toggleTheme,
    navItems,
    navigate,
  } = useNavbar();

  const themeClass = isDark ? '' : 'navbar--light';
  const scrollClass = isScrolled ? 'navbar--scrolled' : '';

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : '?';

  return (
    <nav className={`navbar ${scrollClass} ${themeClass}`}>
      <div className="navbar__inner">

        {/* Logo */}
        <span className="navbar__logo" onClick={() => navigate('/dashboard')}>
          read<span>deck</span>
        </span>

        {/* Dropdown trigger */}
        <div className="navbar__menu-trigger" ref={dropdownRef}>
          <button
            className={`navbar__menu-btn ${dropdownOpen ? 'navbar__menu-btn--open' : ''}`}
            onClick={() => setDropdownOpen(o => !o)}
          >
            Explore
            <span className={`navbar__chevron ${dropdownOpen ? 'navbar__chevron--open' : ''}`}>
              ▼
            </span>
          </button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                className="navbar__dropdown"
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.15 }}
              >
                {navItems.map((item) => (
                  <button
                    key={item.label}
                    className={`navbar__dropdown-item ${item.label === 'Become a Vendor' ? 'navbar__dropdown-item--vendor' : ''}`}
                    onClick={() => { navigate(item.path); setDropdownOpen(false); }}
                  >
                    <span className="navbar__dropdown-emoji">{item.emoji}</span>
                    <span className="navbar__dropdown-label">{item.label}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Spacer */}
        <div className="navbar__spacer" />

        {/* CTA */}
        <button className="navbar__cta" onClick={() => navigate('/books')}>
          Find a Book
        </button>

        {/* Theme toggle */}
        <button className="navbar__theme-toggle" onClick={toggleTheme}>
          {isDark ? '☀️' : '🌙'}
        </button>

        {/* Avatar */}
        <div className="navbar__avatar-wrap" ref={avatarRef}>
          <div
            className="navbar__avatar"
            onClick={() => setAvatarMenuOpen(o => !o)}
          >
            {initials}
          </div>

          <AnimatePresence>
            {avatarMenuOpen && (
              <motion.div
                className="navbar__avatar-menu"
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.15 }}
              >
                <div className="navbar__avatar-header">
                  <p className="navbar__avatar-name">{user?.username}</p>
                  <p className="navbar__avatar-email">{user?.email}</p>
                </div>
                {[
                  { emoji: '👤', label: 'Profile', path: '/profile' },
                  { emoji: '📦', label: 'My Orders', path: '/orders' },
                  { emoji: '🪙', label: 'Rewards', path: '/rewards' },
                ].map((item) => (
                  <button
                    key={item.label}
                    className="navbar__avatar-item"
                    onClick={() => { navigate(item.path); setAvatarMenuOpen(false); }}
                  >
                    <span>{item.emoji}</span>
                    <span className="navbar__avatar-item-label">{item.label}</span>
                  </button>
                ))}
                <button
                  className="navbar__avatar-item navbar__avatar-item--logout"
                  onClick={handleLogout}
                >
                  <span>🚪</span>
                  <span className="navbar__avatar-item-label">Sign out</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;