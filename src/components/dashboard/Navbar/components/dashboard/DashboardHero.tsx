import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Store, Package, Heart, Clock, Truck, Sun, Moon, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../../../context/ThemeContext';
import { useAuth } from '../../../../../context/AuthContext';
import DashboardPhoneMockup from './DashboardPhoneMockup';
import './dashboardHero.css';

const ICON_MAP: Record<string, React.ReactNode> = {
  Search:  <Search  size={18} color="#E8622A" />,
  Store:   <Store   size={18} color="#E8622A" />,
  Package: <Package size={18} color="#E8622A" />,
  Heart:   <Heart   size={18} color="#E8622A" />,
};

// ── Types ─────────────────────────────────────────────────────────

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

// ── Holiday / greeting engine ─────────────────────────────────────

interface GreetingResult {
  main:      string;
  sub:       string;
  isHoliday: boolean;
  iconName:  'Sun' | 'Moon' | 'Sparkles';
}

const HOLIDAYS: Record<string, { main: string; sub: string }> = {
  '1-1':   { main: 'Happy New Year! 🎉',           sub: 'Wishing you an amazing year. Find your first great read of the year.' },
  '2-14':  { main: "Happy Valentine's Day 💝",      sub: 'Share the love — books make the most thoughtful gifts.' },
  '4-18':  { main: 'Happy Good Friday',              sub: 'A blessed long weekend to you.' },
  '4-20':  { main: 'Happy Easter! 🐣',               sub: 'Hope your weekend is full of joy and great reads.' },
  '5-1':   { main: "Happy Workers' Day! 🙌",         sub: "Rest well — you've earned it." },
  '6-12':  { main: 'Happy Democracy Day!',            sub: "Celebrating Nigeria's democratic journey." },
  '10-1':  { main: 'Happy Independence Day! 🇳🇬',   sub: 'Proud to serve Nigerian readers on this special day.' },
  '12-25': { main: 'Merry Christmas! 🎄',             sub: 'Warm wishes from Readdeck to you and yours.' },
  '12-26': { main: 'Happy Boxing Day!',               sub: 'Relax, recharge, and maybe start a new book.' },
  '12-31': { main: "Happy New Year's Eve! 🥂",        sub: 'Last day of the year — make it count.' },
};

// Islamic dates for 2026 — update annually (shift ~11 days each year)
const ISLAMIC_2026: Record<string, { main: string; sub: string }> = {
  '3-30': { main: 'Eid Mubarak! 🌙',     sub: 'Wishing you and your family a blessed Eid al-Fitr.' },
  '6-6':  { main: 'Eid Mubarak! 🌙',     sub: 'May this blessed Eid al-Adha bring peace and joy.' },
  '9-4':  { main: 'Happy Maulid al-Nabi', sub: 'Peace and blessings on this holy day.' },
};

function buildGreeting(username?: string): GreetingResult {
  const now  = new Date();
  const m    = now.getMonth() + 1;
  const d    = now.getDate();
  const h    = now.getHours();
  const key  = `${m}-${d}`;
  const name = username ? `, ${username.split(' ')[0]}` : '';

  const holiday = HOLIDAYS[key] ?? ISLAMIC_2026[key];
  if (holiday) return {
    main:      holiday.main,
    sub:       holiday.sub,
    isHoliday: true,
    iconName:  'Sparkles',
  };

  if (h >= 5  && h < 12) return { main: `Good morning${name}`,  sub: 'Ready to find your next great read?',             isHoliday: false, iconName: 'Sun'  };
  if (h >= 12 && h < 17) return { main: `Good afternoon${name}`, sub: 'Take a break with a good book.',                 isHoliday: false, iconName: 'Sun'  };
  if (h >= 17 && h < 21) return { main: `Good evening${name}`,   sub: 'Wind down with something great to read tonight.', isHoliday: false, iconName: 'Moon' };
  return                         { main: `You're up late${name}`, sub: 'Night owl or early bird — books are always ready.', isHoliday: false, iconName: 'Moon' };
}

// ── Hook ──────────────────────────────────────────────────────────

export const useDashboardHero = () => {
  const { user } = useAuth();
  const greeting = useMemo(() => buildGreeting(user?.username), [user?.username]);
  return { greeting };
};

// ── Component ─────────────────────────────────────────────────────

const DashboardHero: React.FC = () => {
  const { greeting } = useDashboardHero();
  const { isDark }   = useTheme();
  const navigate     = useNavigate();

  const GreetingIcon = greeting.iconName === 'Moon'
    ? <Moon     size={13} color="#8A7968" />
    : greeting.iconName === 'Sparkles'
    ? <Sparkles size={13} color="#E8622A" />
    : <Sun      size={13} color="#8A7968" />;

  return (
    <section className={`dh-section${isDark ? '' : ' dh-section--light'}`}>
      <div className="dh-inner">

        {/* ── LEFT ── */}
        <motion.div
          className="dh-left"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <div className="dh-greeting">
            <p className="dh-greeting__time">
              {GreetingIcon}
              {greeting.isHoliday ? 'Special day' : 'Today'}
            </p>
            <h1 className="dh-greeting__headline">
              {greeting.main}
            </h1>
            <p className="dh-greeting__sub">
              {greeting.sub}
            </p>
          </div>

          <div className="dh-actions">
            {QUICK_ACTIONS.map((action, i) => (
              <motion.button
                key={action.label}
                className={`dh-action${action.accent ? ' dh-action--accent' : ''}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.08, duration: 0.4, ease: 'easeOut' }}
                onClick={() => navigate(action.path)}
              >
                <div className="dh-action__icon">
                  {ICON_MAP[action.icon]}
                </div>
                <div className="dh-action__text">
                  <span className="dh-action__label">{action.label}</span>
                  <span className="dh-action__sub">{action.sub}</span>
                </div>
              </motion.button>
            ))}
          </div>

          <motion.div
            className="dh-status"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            <div className="dh-status__item">
              <span className="dh-status__dot dh-status__dot--live" />
              <span><strong>Bookstores</strong> open near you</span>
            </div>
            <div className="dh-status__dot" />
            <div className="dh-status__item">
              <Clock size={13} color="#8A7968" />
              <span>Avg delivery <strong>25 min</strong></span>
            </div>
            <div className="dh-status__dot" />
            <div className="dh-status__item">
              <Truck size={13} color="#8A7968" />
              <span><strong>Free</strong> delivery today</span>
            </div>
          </motion.div>
        </motion.div>

        {/* ── RIGHT ── */}
        <motion.div
          className="dh-right"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
        >
          <DashboardPhoneMockup />
        </motion.div>

      </div>
    </section>
  );
};

export default DashboardHero;