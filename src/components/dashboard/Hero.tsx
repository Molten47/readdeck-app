import React from 'react';
import { motion } from 'framer-motion';
import PhoneMockup from './PhoneMockup';
import '../../styles/hero.css';

const Hero: React.FC = () => (
  <section className="hero">

    {/* Left */}
    <motion.div
      className="hero__left"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
    >

      <div className="hero__badge">
        📚 Books delivered to your door
      </div>

      <h1 className="hero__headline">
        Your favourite <span>books,</span><br />
        delivered fast
      </h1>

      <p className="hero__subtext">
        Order from local bookstores and get your next
        read delivered in under 30 minutes. Fiction,
        non-fiction, textbooks — we carry it all.
      </p>

      <div className="hero__cta">
        <button className="hero__cta-primary">
          Find bookstores near you
        </button>
        <button className="hero__cta-secondary">
          How it works →
        </button>
      </div>

      <div className="hero__stats">
        <div>
          <p className="hero__stat-value">500+</p>
          <p className="hero__stat-label">Bookstores</p>
        </div>
        <div>
          <p className="hero__stat-value">30min</p>
          <p className="hero__stat-label">Avg delivery</p>
        </div>
        <div>
          <p className="hero__stat-value">50k+</p>
          <p className="hero__stat-label">Happy readers</p>
        </div>
      </div>

    </motion.div>

    {/* Right */}
    <div className="hero__right">
      <PhoneMockup />
    </div>

  </section>
);

export default Hero;