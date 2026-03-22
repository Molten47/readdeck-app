import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import type { Variants } from 'framer-motion';
import type { RefObject } from 'react';

interface NavItem {
  label: string;
  icon:  string;
  path:  string;
}

interface Props {
  open:        boolean;
  setOpen:     (o: boolean | ((prev: boolean) => boolean)) => void;
  navItems:    NavItem[];
  iconMap:     Record<string, React.ReactNode>;
  dropdownRef: RefObject<HTMLDivElement | null>;
  navigate:    (path: string) => void;
}

const pillVariants: Variants = {
  hidden: { opacity: 0, y: -12, scale: 0.88 },
  visible: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: {
      delay: i * 0.055,
      duration: 0.22,
      ease: 'easeOut' as const,
    },
  }),
  exit: (i: number) => ({
    opacity: 0, y: -8, scale: 0.92,
    transition: {
      delay: i * 0.03,
      duration: 0.15,
      ease: 'easeOut' as const,
    },
  }),
};

const ExploreDropdown: React.FC<Props> = ({
  open, setOpen, navItems, iconMap, dropdownRef, navigate,
}) => (
  <div className="navbar__menu-trigger" ref={dropdownRef}>
    <button
      className={`navbar__menu-btn ${open ? 'navbar__menu-btn--open' : ''}`}
      onClick={() => setOpen(o => !o)}
    >
      Explore
      <motion.span
        animate={{ rotate: open ? 180 : 0 }}
        transition={{ duration: 0.2 }}
        style={{ display: 'flex', alignItems: 'center' }}
      >
        <ChevronDown size={13} />
      </motion.span>
    </button>

    <AnimatePresence>
      {open && (
        <div className="navbar__dropdown-pills">
          {navItems.map((item, i) => (
            <motion.button
              key={item.label}
              className={`navbar__dropdown-pill ${item.label === 'Become a Vendor' ? 'navbar__dropdown-pill--vendor' : ''}`}
              custom={i}
              variants={pillVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={() => { navigate(item.path); setOpen(false); }}
            >
              <span className="navbar__dropdown-icon">{iconMap[item.icon]}</span>
              <span className="navbar__dropdown-label">{item.label}</span>
            </motion.button>
          ))}
        </div>
      )}
    </AnimatePresence>
  </div>
);

export default ExploreDropdown;