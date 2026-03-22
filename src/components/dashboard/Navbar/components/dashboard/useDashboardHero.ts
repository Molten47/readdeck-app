import { useMemo } from 'react';
import { useAuth } from '../../../../../context/AuthContext';

// ── Helpers ───────────────────────────────────────────────────────

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function getGreetingIconName(): 'Sun' | 'Moon' {
  const hour = new Date().getHours();
  return hour >= 18 || hour < 6 ? 'Moon' : 'Sun';
}

// ── Types & constants ─────────────────────────────────────────────

export interface QuickAction {
  icon:   string;
  label:  string;
  sub:    string;
  path:   string;
  accent: boolean;
}

export const QUICK_ACTIONS: QuickAction[] = [
  { icon: 'Search',  label: 'Find a book', sub: 'Browse 50k+ titles', path: '/books',      accent: true  },
  { icon: 'Store',   label: 'Bookstores',  sub: 'Near you now',       path: '/bookstores', accent: false },
  { icon: 'Package', label: 'My orders',   sub: 'Track deliveries',   path: '/orders',     accent: false },
  { icon: 'Heart',   label: 'Wishlist',    sub: 'Saved for later',    path: '/wishlist',   accent: false },
];

export const PHONE_BOOKS = [
  { title: 'Atomic Habits', author: 'James Clear',  price: '₦4,500' },
  { title: 'Deep Work',     author: 'Cal Newport',  price: '₦3,800' },
  { title: 'The Alchemist', author: 'Paulo Coelho', price: '₦2,900' },
];

// ── Hook ──────────────────────────────────────────────────────────

export const useDashboardHero = () => {
  const { user } = useAuth();

  const greeting  = useMemo(() => getGreeting(), []);
  const iconName  = useMemo(() => getGreetingIconName(), []);
  const firstName = user?.username?.split(' ')[0] ?? 'there';

  return { greeting, firstName, iconName };
};