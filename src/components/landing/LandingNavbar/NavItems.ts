import React from 'react';
import { BookOpen, Store, MapPin, Compass, Handshake } from 'lucide-react';

// ── Type defined here, imported everywhere else ───────────────────

export interface NavItemDef {
  label: string;
  icon: React.ReactNode;
  path: string;
  dropdown: { label: string; icon: React.ReactNode; path: string }[] | null;
}

// ── Data ──────────────────────────────────────────────────────────

export const NAV_ITEMS: NavItemDef[] = [
  {
    label: 'Books',
    icon: React.createElement(BookOpen, { size: 14 }),
    path: '/signup',
    dropdown: [
      { label: 'Bestsellers',  icon: React.createElement(BookOpen, { size: 13 }), path: '/signup' },
      { label: 'New arrivals', icon: React.createElement(BookOpen, { size: 13 }), path: '/signup' },
      { label: 'Fiction',      icon: React.createElement(BookOpen, { size: 13 }), path: '/signup' },
      { label: 'Non-fiction',  icon: React.createElement(BookOpen, { size: 13 }), path: '/signup' },
    ],
  },
  {
    label: 'Bookstores',
    icon: React.createElement(Store, { size: 14 }),
    path: '/signup',
    dropdown: [
      { label: 'Lagos',         icon: React.createElement(MapPin, { size: 13 }), path: '/signup' },
      { label: 'Abuja',         icon: React.createElement(MapPin, { size: 13 }), path: '/signup' },
      { label: 'Ibadan',        icon: React.createElement(MapPin, { size: 13 }), path: '/signup' },
      { label: 'Port Harcourt', icon: React.createElement(MapPin, { size: 13 }), path: '/signup' },
    ],
  },
  {
    label: 'Explore',
    icon: React.createElement(Compass, { size: 14 }),
    path: '/signup',
    dropdown: [
      { label: 'Book clubs',    icon: React.createElement(BookOpen, { size: 13 }), path: '/signup' },
      { label: 'Events',        icon: React.createElement(Compass,  { size: 13 }), path: '/signup' },
      { label: 'Reading lists', icon: React.createElement(BookOpen, { size: 13 }), path: '/signup' },
    ],
  },
  {
    label: 'Become a vendor',
    icon: React.createElement(Handshake, { size: 14 }),
    path: '/signup',
    dropdown: null,
  },
];