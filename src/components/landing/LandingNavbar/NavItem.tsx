import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import type { NavItemDef } from './NavItems';

interface Props {
  item: NavItemDef;
  isDark: boolean;
  navigate: (path: string) => void;
}

const dropdownItemVariants: Variants = {
  hidden: { opacity: 0, y: -12, scale: 0.88 },
  visible: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { delay: i * 0.055, duration: 0.22, ease: 'easeOut' as const },
  }),
  exit: (i: number) => ({
    opacity: 0, y: -8, scale: 0.92,
    transition: { delay: i * 0.03, duration: 0.15, ease: 'easeOut' as const },
  }),
};

const NavItem: React.FC<Props> = ({ item, isDark, navigate }) => {
  const [open, setOpen]     = useState(false);
  const timeoutRef          = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 120);
  };

  return (
    <div
      className="ln-nav__item"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className={`ln-nav__item-btn ${isDark ? '' : 'ln-nav__item-btn--light'}`}
        onClick={() => navigate(item.path)}
      >
        {item.icon}
        <span>{item.label}</span>
        {item.dropdown && (
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <ChevronDown size={12} />
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {open && item.dropdown && (
          <div className={`ln-nav__dropdown ${isDark ? '' : 'ln-nav__dropdown--light'}`}>
            {item.dropdown.map((d, i) => (
              <motion.button
                key={d.label}
                className={`ln-nav__drop-item ${isDark ? '' : 'ln-nav__drop-item--light'}`}
                custom={i}
                variants={dropdownItemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={() => { navigate(d.path); setOpen(false); }}
              >
                <span className="ln-nav__drop-icon">{d.icon}</span>
                <span>{d.label}</span>
              </motion.button>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NavItem;