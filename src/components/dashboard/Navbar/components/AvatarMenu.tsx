import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Package, Gift, LogOut, LayoutDashboard } from 'lucide-react';

interface Props {
  open:      boolean;
  setOpen:   (o: boolean | ((prev: boolean) => boolean)) => void;
  avatarRef: React.RefObject<HTMLDivElement | null>;
  username:  string | undefined;
  email:     string | undefined;
  initials:  string;
  navigate:  (path: string) => void;
  onLogout:  () => void;
  isVendor:  boolean;
}

const READER_ITEMS = [
  { icon: <User    size={14} />, label: 'Profile',   path: '/profile' },
  { icon: <Package size={14} />, label: 'My Orders', path: '/orders'  },
  { icon: <Gift    size={14} />, label: 'Rewards',   path: '/rewards' },
];

const AvatarMenu: React.FC<Props> = ({
  open, setOpen, avatarRef,
  username, email, initials,
  navigate, onLogout, isVendor,
}) => (
  <div className="navbar__avatar-wrap" ref={avatarRef}>
    <div
      className="navbar__avatar"
      onClick={() => setOpen(o => !o)}
    >
      {initials}
    </div>

    <AnimatePresence>
      {open && (
        <motion.div
          className="navbar__avatar-menu"
          initial={{ opacity: 0, y: -8, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.97 }}
          transition={{ duration: 0.15 }}
        >
          <div className="navbar__avatar-header">
            <p className="navbar__avatar-name">{username}</p>
            <p className="navbar__avatar-email">{email}</p>
            {isVendor && (
              <span className="navbar__avatar-role-badge">Vendor</span>
            )}
          </div>

          {/* Vendor dashboard link — only for vendors */}
          {isVendor && (
            <button
              className="navbar__avatar-item navbar__avatar-item--vendor"
              onClick={() => { navigate('/vendor'); setOpen(false); }}
            >
              <span className="navbar__avatar-item-icon">
                <LayoutDashboard size={14} />
              </span>
              <span className="navbar__avatar-item-label">Vendor Dashboard</span>
            </button>
          )}

          {/* Divider if vendor */}
          {isVendor && <div className="navbar__avatar-divider" />}

          {READER_ITEMS.map(item => (
            <button
              key={item.label}
              className="navbar__avatar-item"
              onClick={() => { navigate(item.path); setOpen(false); }}
            >
              <span className="navbar__avatar-item-icon">{item.icon}</span>
              <span className="navbar__avatar-item-label">{item.label}</span>
            </button>
          ))}

          <button
            className="navbar__avatar-item navbar__avatar-item--logout"
            onClick={onLogout}
          >
            <span className="navbar__avatar-item-icon"><LogOut size={14} /></span>
            <span className="navbar__avatar-item-label">Sign out</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

export default AvatarMenu;