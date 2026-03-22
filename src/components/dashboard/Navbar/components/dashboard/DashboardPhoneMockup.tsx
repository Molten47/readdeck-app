import React from 'react';
import { motion } from 'framer-motion';
import {
  MapPin, Search, Package, BookOpen, Truck,
  Star, Zap,
} from 'lucide-react';
import { PHONE_BOOKS } from './useDashboardHero';

// ── Floating icons config ─────────────────────────────────────────

const FLOATING_ICONS = [
  { icon: <BookOpen size={20} color="#E8622A" />, x: -130, y: -80,  delay: 0   },
  { icon: <Star     size={18} color="#F5F0E8" />, x:  130, y: -60,  delay: 0.3 },
  { icon: <MapPin   size={18} color="#F5F0E8" />, x: -110, y:  90,  delay: 0.6 },
  { icon: <Package  size={18} color="#E8622A" />, x:  120, y:  80,  delay: 0.9 },
  { icon: <Zap      size={16} color="#F5F0E8" />, x:  -60, y: -140, delay: 1.2 },
];

// ── Component ─────────────────────────────────────────────────────

const DashboardPhoneMockup: React.FC = () => (
  <div className="dh-phone-wrap">

    {/* Floating icons */}
    {FLOATING_ICONS.map((icon, i) => (
      <motion.div
        key={i}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          background: '#1A1410',
          border: '1px solid #2A2118',
          borderRadius: '0.6rem',
          padding: '0.4rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2,
          boxShadow: '0 4px 16px #00000050',
        }}
        animate={{
          x: [icon.x - 8, icon.x + 8, icon.x - 8],
          y: [icon.y - 8, icon.y + 8, icon.y - 8],
          rotate: [-5, 5, -5],
        }}
        transition={{
          duration: 3 + icon.delay,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: icon.delay,
        }}
      >
        {icon.icon}
      </motion.div>
    ))}

    {/* Outer shell — gives the physical phone edge depth */}
    <div className="dh-phone__shell">

      {/* Side buttons — left volume */}
      <div className="dh-phone__btn dh-phone__btn--vol-up"  />
      <div className="dh-phone__btn dh-phone__btn--vol-down" />
      {/* Side button — right power */}
      <div className="dh-phone__btn dh-phone__btn--power" />

      {/* Inner screen frame */}
      <motion.div
        className="dh-phone"
        whileHover={{
          boxShadow: '0 0 0 1px #E8622A60, 0 40px 80px #00000080, 0 0 40px #E8622A40',
        }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.3 }}
      >
        {/* Notch */}
        <div className="dh-phone__notch">
          <div style={{
            width: 6, height: 6,
            borderRadius: '50%',
            backgroundColor: '#2A2118',
          }} />
          <div style={{
            width: 10, height: 10,
            borderRadius: '50%',
            backgroundColor: '#1A1410',
            border: '1.5px solid #2A2118',
          }} />
        </div>

        {/* Screen content */}
        <div className="dh-phone__screen">

          <div>
            <p className="dh-phone__deliver-label">Deliver to</p>
            <p className="dh-phone__deliver-addr">
              <MapPin size={12} color="#E8622A" />
              123 Reader's Lane
            </p>
          </div>

          <div className="dh-phone__search">
            <Search size={12} color="#8A7968" />
            <span>Search for books...</span>
          </div>

          <motion.div
            className="dh-phone__banner"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <p className="dh-phone__banner-sub">
              <Package size={11} color="rgba(255,255,255,0.85)" />
              Free delivery today
            </p>
            <p className="dh-phone__banner-title">Books at your door</p>
          </motion.div>

          {PHONE_BOOKS.map((book, i) => (
            <motion.div
              key={i}
              className="dh-phone__book"
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.15, duration: 0.5 }}
            >
              <BookOpen size={22} color="#E8622A" style={{ flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <p className="dh-phone__book-title">{book.title}</p>
                <p className="dh-phone__book-author">{book.author}</p>
              </div>
              <p className="dh-phone__book-price">{book.price}</p>
            </motion.div>
          ))}

          <div className="dh-phone__delivery">
            <motion.div
              animate={{ x: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <Truck size={18} color="#E8622A" />
            </motion.div>
            <div>
              <p className="dh-phone__delivery-title">Your order is on the way</p>
              <p className="dh-phone__delivery-sub">Arriving in 25 mins</p>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  </div>
);

export default DashboardPhoneMockup;