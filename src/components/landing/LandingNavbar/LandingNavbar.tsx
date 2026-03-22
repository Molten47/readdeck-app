import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, ShoppingCart, LayoutDashboard } from 'lucide-react';
import { useLandingNavbar } from './useLandingNavbar';
import { useAuth } from '../../../context/AuthContext';
import NavItem from './NavItem';
import GuestCart from './GuestCart';
import { NAV_ITEMS } from './NavItems';
import './landingNavbar.css';

const LandingNavbar: React.FC = () => {
  const {
    isScrolled,
    guestCartOpen, setGuestCartOpen,
    guestCartRef,
    navigate,
    isDark, toggleTheme,
  } = useLandingNavbar();

  const { user, loading } = useAuth();

  const themeClass  = isDark ? '' : 'ln-nav--light';
  const scrollClass = isScrolled ? 'ln-nav--scrolled' : '';

  // Show guest buttons by default while loading — avoids blank navbar flash.
  // Once auth resolves and we know user is logged in, swap to "Go to app".
  const isLoggedIn = !loading && !!user;

  return (
    <motion.nav
      className={`ln-nav ${scrollClass} ${themeClass}`}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="ln-nav__inner">

        {/* Logo */}
        <span className="ln-nav__logo" onClick={() => navigate('/')}>
          read<span>deck</span>
        </span>

        {/* Nav items */}
        <nav className="ln-nav__menu">
          {NAV_ITEMS.map(item => (
            <NavItem key={item.label} item={item} isDark={isDark} navigate={navigate} />
          ))}
        </nav>

        <div className="ln-nav__spacer" />

        <div className="ln-nav__links">

          {/* Theme toggle — always visible */}
          <button
            className={`ln-nav__toggle ${isDark ? '' : 'ln-nav__toggle--light'}`}
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            <span className="ln-nav__toggle-icon ln-nav__toggle-icon--moon">
              <Moon size={11} />
            </span>
            <span className="ln-nav__toggle-icon ln-nav__toggle-icon--sun">
              <Sun size={11} />
            </span>
            <motion.span
              className="ln-nav__toggle-thumb"
              animate={{ x: isDark ? '0.15rem' : '1.45rem' }}
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            >
              {isDark
                ? <Moon size={12} color="#0F0C09" />
                : <Sun  size={12} color="#0F0C09" />
              }
            </motion.span>
          </button>

          {isLoggedIn ? (
            /* ── Logged in — go straight to app ── */
            <button
              className="ln-nav__signup"
              onClick={() => navigate('/dashboard')}
            >
              <LayoutDashboard size={14} />
              Go to app
            </button>
          ) : (
            /* ── Guest (or loading) — always show CTA ── */
            <>
              <div style={{ position: 'relative' }} ref={guestCartRef}>
                <button
                  className={`ln-nav__cart ${isDark ? '' : 'ln-nav__cart--light'}`}
                  onClick={() => setGuestCartOpen(o => !o)}
                  aria-label="Cart"
                >
                  <ShoppingCart size={16} />
                </button>
                <GuestCart
                  open={guestCartOpen}
                  isDark={isDark}
                  onSignup={() => { navigate('/signup'); setGuestCartOpen(false); }}
                />
              </div>

              <button
                className="ln-nav__link"
                onClick={() => navigate('/login')}
              >
                Log in
              </button>

              <button
                className="ln-nav__signup"
                onClick={() => navigate('/signup')}
              >
                Get started
              </button>
            </>
          )}

        </div>
      </div>
    </motion.nav>
  );
};

export default LandingNavbar;