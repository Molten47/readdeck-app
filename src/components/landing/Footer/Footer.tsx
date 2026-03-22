import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen, MapPin, Package, Calendar,
  Store, User, Twitter, Instagram, Linkedin,
} from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import './footer.css';

const FOOTER_LINKS = [
  {
    title: 'Explore',
    links: [
      { label: 'Browse Books',    path: '/books',      icon: <BookOpen size={14} /> },
      { label: 'Bookstores',      path: '/bookstores', icon: <Store size={14} /> },
      { label: 'Events',          path: '/events',     icon: <Calendar size={14} /> },
      { label: 'Track Order',     path: '/orders',     icon: <Package size={14} /> },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'Sign Up',         path: '/signup',     icon: <User size={14} /> },
      { label: 'Log In',          path: '/login',      icon: <User size={14} /> },
      { label: 'My Orders',       path: '/orders',     icon: <Package size={14} /> },
      { label: 'Rewards',         path: '/rewards',    icon: null },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us',        path: '/',           icon: null },
      { label: 'Become a Vendor', path: '/vendor',     icon: <Store size={14} /> },
      { label: 'Cities',          path: '/',           icon: <MapPin size={14} /> },
      { label: 'Blog',            path: '/',           icon: null },
    ],
  },
];

const SOCIALS = [
  { icon: <Twitter size={15} />,   label: 'Twitter',   href: '#' },
  { icon: <Instagram size={15} />, label: 'Instagram', href: '#' },
  { icon: <Linkedin size={15} />,  label: 'LinkedIn',  href: '#' },
];

// ── App Store Badge ──────────────────────────────────────────────

const AppStoreBadge: React.FC = () => (
  <motion.button
    whileHover={{ scale: 1.04 }}
    whileTap={{ scale: 0.97 }}
    onClick={() => {}}
    style={{
      background: '#000000',
      border: '1px solid #333',
      borderRadius: '10px',
      padding: '8px 16px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      height: '52px',
      minWidth: '148px',
    }}
  >
    {/* Apple logo SVG */}
    <svg width="22" height="26" viewBox="0 0 22 26" fill="white">
      <path d="M18.04 13.84c-.03-3.11 2.54-4.62 2.66-4.69-1.45-2.12-3.71-2.41-4.51-2.44-1.92-.2-3.74 1.14-4.72 1.14-.97 0-2.47-1.11-4.06-1.08-2.09.03-4.02 1.22-5.1 3.09-2.17 3.77-.56 9.36 1.56 12.43 1.04 1.5 2.27 3.19 3.89 3.13 1.56-.06 2.15-1.01 4.04-1.01 1.88 0 2.42 1.01 4.07.98 1.68-.03 2.74-1.53 3.77-3.04 1.18-1.74 1.67-3.42 1.7-3.51-.04-.02-3.27-1.25-3.3-4.99z"/>
      <path d="M14.9 4.6c.87-1.05 1.45-2.51 1.29-3.97-1.25.05-2.75.83-3.64 1.88-.8.92-1.5 2.4-1.31 3.82 1.39.11 2.81-.71 3.66-1.73z"/>
    </svg>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      <span style={{ color: '#aaa', fontSize: '0.6rem', lineHeight: 1, fontFamily: 'inherit' }}>
        Download on the
      </span>
      <span style={{ color: '#fff', fontSize: '1rem', fontWeight: 600, lineHeight: 1.3, fontFamily: 'inherit' }}>
        App Store
      </span>
    </div>
  </motion.button>
);

// ── Google Play Badge ────────────────────────────────────────────

const GooglePlayBadge: React.FC = () => (
  <motion.button
    whileHover={{ scale: 1.04 }}
    whileTap={{ scale: 0.97 }}
    onClick={() => {}}
    style={{
      background: '#000000',
      border: '1px solid #333',
      borderRadius: '10px',
      padding: '8px 16px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      height: '52px',
      minWidth: '148px',
    }}
  >
    {/* Google Play logo SVG (the real coloured triangle) */}
    <svg width="22" height="24" viewBox="0 0 22 24">
      <path d="M0.5 0.8C0.2 1.1 0 1.6 0 2.3v19.4c0 .7.2 1.2.5 1.5l.1.1 10.9-10.9v-.2L0.6 0.7l-.1.1z" fill="#00CFD5"/>
      <path d="M15.1 15.6l-3.6-3.6v-.3l3.6-3.6.1.1 4.3 2.4c1.2.7 1.2 1.8 0 2.5l-4.3 2.4-.1.1z" fill="#FFCA00"/>
      <path d="M15.2 15.5L11.5 12 .5 23c.4.4 1 .4 1.8 0l12.9-7.5z" fill="#FF3D00"/>
      <path d="M15.2 8.5L2.3 1C1.5.6.9.6.5 1L11.5 12l3.7-3.5z" fill="#00F076"/>
    </svg>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      <span style={{ color: '#aaa', fontSize: '0.6rem', lineHeight: 1, fontFamily: 'inherit' }}>
        Get it on
      </span>
      <span style={{ color: '#fff', fontSize: '1rem', fontWeight: 600, lineHeight: 1.3, fontFamily: 'inherit' }}>
        Google Play
      </span>
    </div>
  </motion.button>
);

// ── Sub-components ───────────────────────────────────────────────

const BrandCol: React.FC<{ isDark: boolean }> = ({}) => (
  <div>
    <p className="ft-brand__logo">read<span>deck</span></p>
    <p className="ft-brand__desc">
      Nigeria's fastest book delivery platform. From your favourite bookstore to your door — in minutes.
    </p>
    <div className="ft-socials">
      {SOCIALS.map((s) => (
        <button
          key={s.label}
          className="ft-social-btn"
          aria-label={s.label}
          onClick={() => {}}
        >
          {s.icon}
        </button>
      ))}
    </div>
  </div>
);

const LinkCol: React.FC<{ col: typeof FOOTER_LINKS[0]; navigate: (path: string) => void }> = ({ col, navigate }) => (
  <div>
    <p className="ft-col__title">{col.title}</p>
    <ul className="ft-col__links">
      {col.links.map((link) => (
        <li key={link.label}>
          <button className="ft-col__link" onClick={() => navigate(link.path)}>
            {link.label}
          </button>
        </li>
      ))}
    </ul>
  </div>
);

// ── Main Footer ──────────────────────────────────────────────────

const Footer: React.FC = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();

  return (
    <footer className={`ft-footer ${isDark ? '' : 'ft-footer--light'}`}>
      <div className="ft-grid">
        <BrandCol isDark={isDark} />
        {FOOTER_LINKS.map((col) => (
          <LinkCol key={col.title} col={col} navigate={navigate} />
        ))}
      </div>

      <div className="ft-bottom">
        <p className="ft-bottom__copy">
          © 2025 <span>Readdeck</span>. Made with 📚 in Nigeria.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <AppStoreBadge />
          <GooglePlayBadge />
        </div>
      </div>
    </footer>
  );
};

export default Footer;