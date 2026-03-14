import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';
import { useBestSellers } from './useBestSellers';
import { IMAGE_MAP, BG_MAP, formatPrice, formatRating } from './useBestSellers';
import type { Book } from './useBestSellers';

const getStyles = (isDark: boolean) => ({
  section:  { backgroundColor: isDark ? '#0F0C09' : '#FAF7F2', padding: '6rem 2rem' } as React.CSSProperties,
  inner:    { maxWidth: '1280px', margin: '0 auto' } as React.CSSProperties,
  header:   { display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap' as const, gap: '1rem' },
  eyebrow:  { color: '#E8622A', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, margin: '0 0 0.5rem' },
  title:    { color: isDark ? '#F5F0E8' : '#1A1410', fontSize: '2.25rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' },
  cta:      { background: 'none', border: `1.5px solid ${isDark ? '#2A2118' : '#E8E0D0'}`, borderRadius: '2rem', padding: '0.55rem 1.25rem', color: '#8A7968', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' as const, fontFamily: 'inherit' },
  grid:     { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' },
  card:     { backgroundColor: isDark ? '#1A1410' : '#FFFFFF', border: `1px solid ${isDark ? '#2A2118' : '#E8E0D0'}`, borderRadius: '1.25rem', padding: '1.5rem', display: 'flex', flexDirection: 'column' as const, gap: '0.6rem', cursor: 'pointer', position: 'relative' as const, overflow: 'hidden' },
  rank:     (gold: boolean) => ({ position: 'absolute' as const, top: '1rem', right: '1rem', width: '1.75rem', height: '1.75rem', borderRadius: '50%', background: gold ? 'linear-gradient(135deg, #FFD700, #FFA500)' : '#E8622A', color: 'white', fontSize: '0.7rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }),
  cover:    (bg: string) => ({ height: '200px', background: bg, borderRadius: '0.75rem', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem', flexShrink: 0 }),
  tag:      { background: '#E8622A18', color: '#E8622A', fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' as const, padding: '0.22rem 0.55rem', borderRadius: '1rem', width: 'fit-content' },
  bktitle:  { color: isDark ? '#F5F0E8' : '#1A1410', fontSize: '0.92rem', fontWeight: 700, margin: 0, lineHeight: 1.3 },
  author:   { color: '#8A7968', fontSize: '0.75rem', margin: 0 },
  footer:   { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '0.75rem', borderTop: `1px solid ${isDark ? '#2A2118' : '#E8E0D0'}` },
  price:    { color: '#E8622A', fontSize: '0.95rem', fontWeight: 800, margin: 0 },
  ratingW:  { display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#8A7968', fontSize: '0.7rem', marginTop: '0.15rem' },
  addBtn:   { width: '2.1rem', height: '2.1rem', borderRadius: '50%', background: '#E8622A', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  skelCard: { backgroundColor: isDark ? '#1A1410' : '#F0EAE0', border: `1px solid ${isDark ? '#2A2118' : '#E8E0D0'}`, borderRadius: '1.25rem', padding: '1.5rem', display: 'flex', flexDirection: 'column' as const, gap: '0.75rem' },
  skel:     (w: string, h: string) => ({ width: w, height: h, borderRadius: '0.5rem', background: isDark ? '#2A2118' : '#E8E0D0' }),
});

// ── Skeleton ──────────────────────────────────────────────────────

const SkeletonCard = ({ isDark }: { isDark: boolean }) => {
  const s = getStyles(isDark);
  return (
    <div style={s.skelCard}>
      <div style={s.skel('100%', '200px')} />
      <div style={s.skel('60px', '18px')} />
      <div style={s.skel('90%', '16px')} />
      <div style={s.skel('60%', '14px')} />
      <div style={{ ...s.skel('100%', '32px'), marginTop: 'auto' }} />
    </div>
  );
};

// ── Book Card ─────────────────────────────────────────────────────

const BookCard = ({ book, index, isDark }: { book: Book; index: number; isDark: boolean }) => {
  const navigate = useNavigate();

  // Guard — must come after hooks, before any property access
  if (!book || !book.title) return null;

  const s = getStyles(isDark);
  const coverImage = IMAGE_MAP[book.title];
  const bg = BG_MAP[book.category_name] ?? '#1A1410';

  return (
    <motion.div
      style={s.card}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ borderColor: '#E8622A50', y: -4 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.45 }}
      onClick={() => navigate('/signup')}
    >
      {/* Rank badge */}
      <div style={s.rank(index === 0)}>#{index + 1}</div>

      {/* Cover — real image or coloured fallback */}
      <div style={s.cover(bg)}>
        {coverImage ? (
          <img
            src={coverImage}
            alt={book.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <span>📚</span>
        )}
      </div>

      <span style={s.tag}>{book.category_name}</span>
      <p style={s.bktitle}>{book.title}</p>
      <p style={s.author}>{book.author}</p>

      <div style={s.footer}>
        <div>
          <p style={s.price}>{formatPrice(book.price)}</p>
          <div style={s.ratingW}>
            <Star size={11} fill="#E8622A" color="#E8622A" />
            <span>{formatRating(book.rating)}</span>
          </div>
        </div>
        <button
          style={s.addBtn}
          onClick={e => { e.stopPropagation(); navigate('/signup'); }}
        >
          <ShoppingBag size={14} />
        </button>
      </div>
    </motion.div>
  );
};

// ── Main Component ────────────────────────────────────────────────

const BestSellers: React.FC = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { books, loading, error } = useBestSellers();
  const s = getStyles(isDark);

  return (
    <section style={s.section}>
      <div style={s.inner}>

        <div style={s.header}>
          <div>
            <p style={s.eyebrow}>🔥 Trending now</p>
            <h2 style={s.title}>This week's bestsellers</h2>
          </div>
          <button style={s.cta} onClick={() => navigate('/signup')}>
            View all books →
          </button>
        </div>

        {error && (
          <p style={{ color: '#8A7968', textAlign: 'center', padding: '2rem 0' }}>
            Could not load books — make sure the backend is running.
          </p>
        )}

        <div style={s.grid}>
          {loading
            ? [...Array(4)].map((_, i) => <SkeletonCard key={i} isDark={isDark} />)
            : books
                .filter((book): book is Book => !!book?.title)
                .map((book, i) => (
                  <BookCard key={book.id} book={book} index={i} isDark={isDark} />
                ))
          }
        </div>

      </div>
    </section>
  );
};

export default BestSellers;