import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';

export const useLandingNavbar = () => {
  const [isScrolled, setIsScrolled]         = useState(false);
  const [guestCartOpen, setGuestCartOpen]   = useState(false);
  const guestCartRef = useRef<HTMLDivElement>(null);
  const navigate     = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (guestCartRef.current && !guestCartRef.current.contains(e.target as Node)) {
        setGuestCartOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return {
    isScrolled,
    guestCartOpen, setGuestCartOpen,
    guestCartRef,
    navigate,
    isDark, toggleTheme,
  };
};