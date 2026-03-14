import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, MapPin, MessageCircle } from 'lucide-react';
import { useTestimonials, TESTIMONIALS } from './useTestimonials';
import { useTheme } from '../../../context/ThemeContext';
import './testimonials.css';

// ── SVG Star ─────────────────────────────────────────────────────

const Star: React.FC<{ filled?: boolean }> = ({ filled = true }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? '#E8622A' : 'none'}
    stroke="#E8622A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

// ── Main Component ────────────────────────────────────────────────

const Testimonials: React.FC = () => {
  const { active, next, prev, goTo, total } = useTestimonials();
  const { isDark } = useTheme();
  const t = TESTIMONIALS[active];

  return (
    <section className={`tm-section ${isDark ? '' : 'tm-section--light'}`}>

      {/* Header */}
      <motion.div
        className="tm-header"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="tm-eyebrow">
          <MessageCircle size={13} color="#E8622A" />
          <span>What readers say</span>
        </div>
        <h2 className="tm-title">
          Loved by readers<br />across Nigeria
        </h2>
        <p className="tm-sub">
          Real stories from real book lovers who found their next great read through Readdeck.
        </p>
      </motion.div>

      {/* Slider — no card wrapper */}
      <div className="tm-slider">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            className="tm-content"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            {/* Large quote mark */}
            <div className="tm-quote">"</div>

            {/* Stars */}
            <div className="tm-stars">
              {[...Array(t.rating)].map((_, i) => (
                <Star key={i} filled />
              ))}
            </div>

            {/* Comment */}
            <p className="tm-comment">
              {t.comment}
            </p>

            {/* Avatar row */}
            <div className="tm-avatar-wrap">
              <div className="tm-avatar">{t.avatar}</div>
              <div>
                <p className="tm-name">{t.name}</p>
                <p className="tm-role">{t.role}</p>
                <p className="tm-city">
                  <MapPin size={11} color="#E8622A" style={{ display: 'inline', marginRight: '0.25rem', verticalAlign: 'middle' }} />
                  {t.city}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Controls */}
        <div className="tm-controls">
          <button className="tm-arrow" onClick={prev}>
            <ChevronLeft size={18} />
          </button>

          <div className="tm-dots">
            {[...Array(total)].map((_, i) => (
              <button
                key={i}
                className={`tm-dot ${i === active ? 'tm-dot--active' : ''}`}
                onClick={() => goTo(i)}
              />
            ))}
          </div>

          <button className="tm-arrow" onClick={next}>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

    </section>
  );
};

export default Testimonials;