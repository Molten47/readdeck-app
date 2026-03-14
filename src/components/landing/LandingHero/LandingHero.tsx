import React from 'react';
import { motion } from 'framer-motion';
import {
  MapPin, Mail, Lock, Package, Zap, Star,
  Search, BookOpen, Truck, Home, ShoppingBag,
} from 'lucide-react';
import { useLandingHero, FLOATING_STATS, PHONE_BOOKS } from './useLandingHero';
import { useTheme } from '../../../context/ThemeContext';
import './landingHero.css';

const FLOATING_ICONS = [
  { icon: <BookOpen size={22} color="#E8622A" />, x: -130, y: -80,  delay: 0   },
  { icon: <BookOpen size={20} color="#F5F0E8" />, x:  130, y: -60,  delay: 0.3 },
  { icon: <Home     size={20} color="#F5F0E8" />, x: -110, y:  90,  delay: 0.6 },
  { icon: <Package  size={20} color="#E8622A" />, x:  120, y:  80,  delay: 0.9 },
  { icon: <Star     size={18} color="#F5F0E8" />, x:  -65, y: -140, delay: 1.2 },
];

const STAT_ICONS: Record<string, React.ReactNode> = {
  '📦': <Package  size={20} color="#E8622A" />,
  '🏪': <ShoppingBag size={20} color="#E8622A" />,
  '🏙️': <MapPin   size={20} color="#E8622A" />,
  '⚡': <Zap      size={20} color="#E8622A" />,
};

const LandingHero: React.FC = () => {
  const { email, setEmail, handleSubmit, handleKeyDown } = useLandingHero();
  const { isDark } = useTheme();

  return (
    <section className={`lh-section ${isDark ? '' : 'lh-section--light'}`}>
      <div className="lh-grid">

        {/* ── LEFT ── */}
        <motion.div
          className="lh-left"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          {/* Eyebrow */}
          <div className="lh-eyebrow">
            <MapPin size={13} color="#E8622A" />
            <span>Now delivering across Nigeria</span>
          </div>

          {/* Headline */}
          <h1 className="lh-headline">
            Books delivered
            <span className="lh-headline__accent">to your door.</span>
            In minutes.
          </h1>

          {/* Subtext */}
          <p className="lh-subtext">
            Readdeck connects you with the best bookstores in your city. Order your next favourite read and have it delivered fast — no queues, no hassle.
          </p>

          {/* Email CTA */}
          <div className="lh-cta">
            <div className="lh-cta__input-wrap">
              <Mail size={16} color="#8A7968" />
              <input
                className="lh-cta__input"
                type="email"
                placeholder="Enter your email to get started..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <button className="lh-cta__btn" onClick={handleSubmit}>
              Get started →
            </button>
            <p className="lh-cta__note" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Lock size={12} color="#8A7968" />
              Free to join. No credit card required.
            </p>
          </div>

          {/* Stats */}
          <div className="lh-stats">
            {FLOATING_STATS.map((stat) => (
              <motion.div
                key={stat.label}
                className="lh-stat"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <span className="lh-stat__emoji">
                  {STAT_ICONS[stat.emoji] ?? <Zap size={20} color="#E8622A" />}
                </span>
                <div>
                  <p className="lh-stat__value">{stat.value}</p>
                  <p className="lh-stat__label">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── RIGHT — Phone ── */}
        <motion.div
          className="lh-right"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
        >
          <div className="lh-phone-wrap">

            {/* Floating icons */}
            {FLOATING_ICONS.map((icon, i) => (
              <motion.div
                key={i}
                className="lh-floating-icon"
                style={{
                  top: '50%',
                  left: '50%',
                  background: '#1A1410',
                  border: '1px solid #2A2118',
                  borderRadius: '0.6rem',
                  padding: '0.4rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
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

            {/* Phone */}
            <motion.div
              className="lh-phone"
              whileHover={{
                boxShadow: '0 40px 80px #00000080, 0 0 40px #E8622A40, 0 0 80px #E8622A20',
              }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="lh-phone__notch">
                <div style={{
                  width: '6px', height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#2A2118',
                }} />
                <div style={{
                  width: '10px', height: '10px',
                  borderRadius: '50%',
                  backgroundColor: '#1A1410',
                  border: '1.5px solid #2A2118',
                }} />
              </div>

              <div className="lh-phone__screen">

                <div>
                  <p className="lh-phone__deliver-label">Deliver to</p>
                  <p className="lh-phone__deliver-addr" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <MapPin size={12} color="#E8622A" />
                    123 Reader's Lane
                  </p>
                </div>

                <div className="lh-phone__search" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Search size={12} color="#8A7968" />
                  <span>Search for books...</span>
                </div>

                <motion.div
                  className="lh-phone__banner"
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <p className="lh-phone__banner-sub" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Package size={11} color="rgba(255,255,255,0.85)" />
                    Free delivery today
                  </p>
                  <p className="lh-phone__banner-title">Books at your door</p>
                </motion.div>

                {PHONE_BOOKS.map((book, i) => (
                  <motion.div
                    key={i}
                    className="lh-phone__book"
                    initial={{ x: 40, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 + i * 0.15, duration: 0.5 }}
                  >
                    <BookOpen size={22} color="#E8622A" style={{ flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <p className="lh-phone__book-title">{book.title}</p>
                      <p className="lh-phone__book-author">{book.author}</p>
                    </div>
                    <p className="lh-phone__book-price">{book.price}</p>
                  </motion.div>
                ))}

                <div className="lh-phone__delivery">
                  <motion.div
                    animate={{ x: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ display: 'flex', alignItems: 'center' }}
                  >
                    <Truck size={18} color="#E8622A" />
                  </motion.div>
                  <div>
                    <p className="lh-phone__delivery-title">Your order is on the way</p>
                    <p className="lh-phone__delivery-sub">Arriving in 25 mins</p>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default LandingHero;