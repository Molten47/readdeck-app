import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const FLOATING_STATS = [
  { value: '2,400+', label: 'Books delivered', emoji: '📦' },
  { value: '11',     label: 'Bookstores',      emoji: '🏪' },
  { value: '4',      label: 'Cities',           emoji: '🏙️' },
  { value: '25min',  label: 'Avg delivery',     emoji: '⚡' },
];

export const PHONE_BOOKS = [
  { title: 'Atomic Habits',       author: 'James Clear',             price: '₦4,500', emoji: '📘' },
  { title: 'Things Fall Apart',   author: 'Chinua Achebe',           price: '₦2,500', emoji: '📗' },
  { title: 'Deep Work',           author: 'Cal Newport',             price: '₦3,800', emoji: '📙' },
];

export const useLandingHero = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (email.trim()) {
      navigate(`/signup?email=${encodeURIComponent(email)}`);
    } else {
      navigate('/signup');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return {
    email, setEmail,
    submitted,
    handleSubmit,
    handleKeyDown,
    navigate,
  };
};