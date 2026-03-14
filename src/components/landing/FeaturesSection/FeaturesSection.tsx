import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Store, BookOpen, Coins, Calendar, Handshake, Package, Star } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import './featuresSection.css';

const FEATURES = [
  {
    icon: <Zap size={22} />,
    title: 'Lightning fast delivery',
    desc: 'Get your books delivered in as little as 25 minutes from the best bookstores near you.',
  },
  {
    icon: <Store size={22} />,
    title: 'Curated bookstores',
    desc: 'Browse handpicked bookstores across Lagos, Abuja, Ibadan and Port Harcourt with real ratings.',
  },
  {
    icon: <BookOpen size={22} />,
    title: 'Thousands of titles',
    desc: 'From Chinua Achebe to Cal Newport — fiction, self-help, textbooks and more, all in one place.',
  },
  {
    icon: <Coins size={22} />,
    title: 'Earn rewards',
    desc: 'Every order earns you Readdeck coins. Redeem them for discounts on your next purchase.',
  },
  {
    icon: <Calendar size={22} />,
    title: 'Book events & clubs',
    desc: 'Join reading circles and book club events happening near you. Connect with fellow readers.',
  },
  {
    icon: <Handshake size={22} />,
    title: 'Sell with us',
    desc: 'Own a bookstore? Partner with Readdeck and reach thousands of readers in your city.',
  },
];

// ── App Store Badge ──────────────────────────────────────────────

const AppStoreBadge: React.FC = () => (
  <motion.button
    whileHover={{ scale: 1.04 }}
    whileTap={{ scale: 0.97 }}
    className="fs-download__btn"
  >
    <svg width="1.5rem" height="1.75rem" viewBox="0 0 22 26" fill="white" style={{ flexShrink: 0 }}>
      <path d="M18.04 13.84c-.03-3.11 2.54-4.62 2.66-4.69-1.45-2.12-3.71-2.41-4.51-2.44-1.92-.2-3.74 1.14-4.72 1.14-.97 0-2.47-1.11-4.06-1.08-2.09.03-4.02 1.22-5.1 3.09-2.17 3.77-.56 9.36 1.56 12.43 1.04 1.5 2.27 3.19 3.89 3.13 1.56-.06 2.15-1.01 4.04-1.01 1.88 0 2.42 1.01 4.07.98 1.68-.03 2.74-1.53 3.77-3.04 1.18-1.74 1.67-3.42 1.7-3.51-.04-.02-3.27-1.25-3.3-4.99z"/>
      <path d="M14.9 4.6c.87-1.05 1.45-2.51 1.29-3.97-1.25.05-2.75.83-3.64 1.88-.8.92-1.5 2.4-1.31 3.82 1.39.11 2.81-.71 3.66-1.73z"/>
    </svg>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      <span className="fs-download__btn-sub">Download on the</span>
      <span className="fs-download__btn-label">App Store</span>
    </div>
  </motion.button>
);

// ── Google Play Badge ────────────────────────────────────────────

const GooglePlayBadge: React.FC = () => (
  <motion.button
    whileHover={{ scale: 1.04 }}
    whileTap={{ scale: 0.97 }}
    className="fs-download__btn"
  >
    <svg width="1.5rem" height="1.5rem" viewBox="0 0 22 24" style={{ flexShrink: 0 }}>
      <path d="M0.5 0.8C0.2 1.1 0 1.6 0 2.3v19.4c0 .7.2 1.2.5 1.5l.1.1 10.9-10.9v-.2L0.6 0.7l-.1.1z" fill="#00CFD5"/>
      <path d="M15.1 15.6l-3.6-3.6v-.3l3.6-3.6.1.1 4.3 2.4c1.2.7 1.2 1.8 0 2.5l-4.3 2.4-.1.1z" fill="#FFCA00"/>
      <path d="M15.2 15.5L11.5 12 .5 23c.4.4 1 .4 1.8 0l12.9-7.5z" fill="#FF3D00"/>
      <path d="M15.2 8.5L2.3 1C1.5.6.9.6.5 1L11.5 12l3.7-3.5z" fill="#00F076"/>
    </svg>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      <span className="fs-download__btn-sub">Get it on</span>
      <span className="fs-download__btn-label">Google Play</span>
    </div>
  </motion.button>
);

// ── Main Component ───────────────────────────────────────────────

const FeaturesSection: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <section className={`fs-section ${isDark ? '' : 'fs-section--light'}`}>

      {/* Header */}
      <div className="fs-section__header">
        <p className="fs-section__eyebrow">Why Readdeck</p>
        <h2 className="fs-section__title">
          Everything you need,<br />delivered with your book
        </h2>
        <p className="fs-section__sub">
          We built Readdeck because books deserve the same convenience as food delivery — fast, reliable, and joyful.
        </p>
      </div>

      {/* Feature cards */}
      <div className="fs-grid">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            className="fs-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
          >
            <div className="fs-card__icon">{f.icon}</div>
            <p className="fs-card__title">{f.title}</p>
            <p className="fs-card__desc">{f.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Download section */}
      <motion.div
        className="fs-download"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div>
          <p className="fs-download__eyebrow">Mobile app</p>
          <h3 className="fs-download__title">
            Take Readdeck<br />everywhere you go
          </h3>
          <p className="fs-download__sub">
            Order books on the go, track your delivery in real time, and discover new reads — all from your pocket.
          </p>
          <div className="fs-download__btns">
            <AppStoreBadge />
            <GooglePlayBadge />
          </div>
        </div>

        {/* Visual mockups */}
        <div className="fs-download__visual">
          {[0, 1].map((n) => (
            <motion.div
              key={n}
              className="fs-download__mockup"
              animate={{ y: [0, n === 0 ? -10 : 10, 0] }}
              transition={{ duration: 3 + n, repeat: Infinity, ease: 'easeInOut' }}
              style={{ marginTop: n === 1 ? '2rem' : '0' }}
            >
              <div className="fs-download__mockup-bar fs-download__mockup-bar--accent" />
              <div className="fs-download__mockup-bar" />
              {[...Array(3)].map((_, i) => (
                <div key={i} className="fs-download__mockup-card">
                  <div className="fs-download__mockup-dot">
                    {[
                      <BookOpen size={14} color="#E8622A" />,
                      <Package size={14} color="#E8622A" />,
                      <Star size={14} color="#E8622A" />,
                    ][i]}
                  </div>
                  <div className="fs-download__mockup-line" />
                </div>
              ))}
            </motion.div>
          ))}
        </div>
      </motion.div>

    </section>
  );
};

export default FeaturesSection;