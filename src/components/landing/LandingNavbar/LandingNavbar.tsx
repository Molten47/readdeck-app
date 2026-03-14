import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import './landingNavbar.css';

const LandingNavbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const themeClass = isDark ? '' : 'ln-nav--light';
  const scrollClass = isScrolled ? 'ln-nav--scrolled' : '';

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

        <div className="ln-nav__spacer" />

        <div className="ln-nav__links">

          {/* Fancy toggle */}
          <button
            className={`ln-nav__toggle ${isDark ? '' : 'ln-nav__toggle--light'}`}
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {/* Track icons */}
            <span className="ln-nav__toggle-icon ln-nav__toggle-icon--moon">
              <Moon size={11} />
            </span>
            <span className="ln-nav__toggle-icon ln-nav__toggle-icon--sun">
              <Sun size={11} />
            </span>

            {/* Sliding thumb */}
            <motion.span
              className="ln-nav__toggle-thumb"
              layout
              animate={{ x: isDark ? '0.15rem' : '1.45rem' }}
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            >
              {isDark
                ? <Moon size={12} color="#0F0C09" />
                : <Sun  size={12} color="#0F0C09" />
              }
            </motion.span>
          </button>

          <button className="ln-nav__link" onClick={() => navigate('/login')}>
            Log in
          </button>
          <button className="ln-nav__signup" onClick={() => navigate('/signup')}>
            Get started
          </button>

        </div>
      </div>
    </motion.nav>
  );
};

export default LandingNavbar;