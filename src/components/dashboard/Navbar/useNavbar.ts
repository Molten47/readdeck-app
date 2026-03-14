import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';

export const useNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setAvatarMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Orders',           emoji: '📦', path: '/orders' },
    { label: 'Bookstores',       emoji: '🏪', path: '/bookstores' },
    { label: 'Books',            emoji: '📚', path: '/books' },
    { label: 'Events',           emoji: '🎉', path: '/events' },
    { label: 'Become a Vendor',  emoji: '🤝', path: '/vendor' },
  ];

  return {
    isScrolled,
    dropdownOpen, setDropdownOpen,
    avatarMenuOpen, setAvatarMenuOpen,
    dropdownRef, avatarRef,
    user, handleLogout,
    theme, toggleTheme, isDark,
    navItems,
    navigate,
  };
};