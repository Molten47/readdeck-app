import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Leaf } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

const BLOCK_ONE_IMAGES = [
  'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=700&q=80',
  'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=700&q=80',
  'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=700&q=80',
  'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=700&q=80',
];

const BLOCK_TWO_IMAGES = [
  'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=700&q=80',
  'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=700&q=80',
  'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=700&q=80',
  'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=700&q=80',
];

const CardStack: React.FC<{ images: string[] }> = ({ images }) => {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setCurrent(i => (i + 1) % images.length), 2800);
    return () => clearInterval(timer);
  }, [images.length]);
  const prev = (current - 1 + images.length) % images.length;
  const next = (current + 1) % images.length;
  return (
    <div style={{ position: 'relative', width: '26rem', height: '32rem', flexShrink: 0 }}>
      <motion.div animate={{ rotate: 6, x: '1.2rem', y: '0.9rem', scale: 0.93 }} transition={{ duration: 0.6, ease: 'easeOut' }} style={{ position: 'absolute', inset: 0, overflow: 'hidden', boxShadow: '0 1.25rem 3.75rem #00000060' }}>
        <img src={images[next]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      </motion.div>
      <motion.div animate={{ rotate: -4, x: '-0.6rem', y: '0.5rem', scale: 0.96 }} transition={{ duration: 0.6, ease: 'easeOut' }} style={{ position: 'absolute', inset: 0, overflow: 'hidden', boxShadow: '0 1.25rem 3.75rem #00000060' }}>
        <img src={images[prev]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      </motion.div>
      <AnimatePresence mode="wait">
        <motion.div key={current} initial={{ opacity: 0, scale: 0.92, rotate: -3, y: '1.25rem' }} animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }} exit={{ opacity: 0, scale: 1.04, rotate: 4, y: '-1.25rem' }} transition={{ duration: 0.55, ease: 'easeOut' }} style={{ position: 'absolute', inset: 0, overflow: 'hidden', boxShadow: '0 1.875rem 5rem #00000070, 0 0 0 0.0625rem #ffffff15', zIndex: 3 }}>
          <img src={images[current]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #ffffff08 0%, transparent 60%)' }} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const MobileImage: React.FC<{ images: string[] }> = ({ images }) => {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setCurrent(i => (i + 1) % images.length), 3000);
    return () => clearInterval(t);
  }, [images.length]);
  return (
    <AnimatePresence mode="wait">
      <motion.div key={current} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="promo-mobile-img">
        <img src={images[current]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      </motion.div>
    </AnimatePresence>
  );
};

interface ContentProps {
  tag: React.ReactNode; tagLabel: string;
  headline: string; headlineAccent: string; sub: string;
  cta: string; ctaGhost: string; ctaPath: string; ctaGhostPath: string;
  isDark: boolean; reverse?: boolean;
}

const Content: React.FC<ContentProps> = ({ tag, tagLabel, headline, headlineAccent, sub, cta, ctaGhost, ctaPath, ctaGhostPath, isDark }) => {
  const navigate = useNavigate();
  return (
    <motion.div initial={{ opacity: 0, x: '-1.875rem' }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease: 'easeOut' }} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', maxWidth: '30rem' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#E8622A18', border: '1px solid #E8622A40', borderRadius: '2rem', padding: '0.45rem 1rem', color: '#E8622A', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' as const, width: 'fit-content' }}>
        {tag}<span>{tagLabel}</span>
      </div>
      <h2 style={{ color: isDark ? '#F5F0E8' : '#1A1410', fontSize: '3.25rem', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.03em', margin: 0 }}>
        {headline}<br /><span style={{ color: '#E8622A' }}>{headlineAccent}</span>
      </h2>
      <p style={{ color: '#8A7968', fontSize: '1.05rem', lineHeight: 1.75, margin: 0 }}>{sub}</p>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' as const }}>
        <button onClick={() => navigate(ctaPath)} style={{ background: '#E8622A', border: 'none', borderRadius: '2rem', padding: '0.875rem 1.875rem', color: 'white', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
          {cta} →
        </button>
        <button onClick={() => navigate(ctaGhostPath)} style={{ background: 'none', border: `1.5px solid ${isDark ? '#2A2118' : '#E8E0D0'}`, borderRadius: '2rem', padding: '0.875rem 1.875rem', color: isDark ? '#8A7968' : '#8B5E3C', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
          {ctaGhost}
        </button>
      </div>
    </motion.div>
  );
};

interface PromoBlockProps {
  images: string[]; reverse?: boolean;
  tag: React.ReactNode; tagLabel: string;
  headline: string; headlineAccent: string; sub: string;
  cta: string; ctaGhost: string; ctaPath: string; ctaGhostPath: string;
}

const PromoBlock: React.FC<PromoBlockProps> = ({ images, reverse, ...rest }) => {
  const { isDark } = useTheme();
  return (
    <section className="promo-section" style={{ backgroundColor: isDark ? '#0F0C09' : '#FAF7F2' }}>

      {/* ── Desktop — display controlled by CSS only, no inline display ── */}
      <div
        className="promo-desktop"
        style={{
          maxWidth: '75rem',
          margin: '0 auto',
          alignItems: 'center',
          gap: '5rem',
          flexDirection: reverse ? 'row-reverse' : 'row',
          // ↑ NO display:flex here — CSS class handles it
        }}
      >
        <Content {...rest} isDark={isDark} />
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <CardStack images={images} />
        </div>
      </div>

      {/* ── Mobile — display controlled by CSS only ── */}
      <div className="promo-mobile">
        <MobileImage images={images} />
        <div className="promo-mobile-content">
          <Content {...rest} isDark={isDark} />
        </div>
      </div>

    </section>
  );
};

export const PromoBlockOne: React.FC = () => (
  <PromoBlock
    images={BLOCK_ONE_IMAGES}
    tag={<BookOpen size={13} />} tagLabel="Book club culture"
    headline="Read together." headlineAccent="Grow together."
    sub="Join thousands of Nigerians discovering their next favourite book through community, connection, and great stories delivered right to their door."
    cta="Join a book club" ctaGhost="Browse books"
    ctaPath="/signup" ctaGhostPath="/signup" reverse={false}
  />
);

export const PromoBlockTwo: React.FC = () => (
  <PromoBlock
    images={BLOCK_TWO_IMAGES}
    tag={<Leaf size={13} />} tagLabel="Your reading sanctuary"
    headline="Every book," headlineAccent="a new world."
    sub="From the comfort of your home or out on the grass — your next great read is just a few taps away. We bring the bookstore to you."
    cta="Start reading" ctaGhost="See bookstores"
    ctaPath="/signup" ctaGhostPath="/signup" reverse={true}
  />
);