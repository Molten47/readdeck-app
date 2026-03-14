import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Book } from './useBestSellers';
import { IMAGE_MAP, BG_MAP, formatPrice, formatRating } from './useBestSellers';

interface Props {
  book: Book;
  index: number;
  isDark: boolean;
}

// ── Skeleton ──────────────────────────────────────────────────────

export const SkeletonCard: React.FC<{ isDark: boolean }> = ({ isDark }) => (
  <div style={{
    backgroundColor: isDark ? '#1A1410' : '#F0EAE0',
    border: `1px solid ${isDark ? '#2A2118' : '#E8E0D0'}`,
    borderRadius: '1.25rem',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  }}>
    {[['100%', '200px'], ['60px', '18px'], ['90%', '16px'], ['60%', '14px']].map(([w, h], i) => (
      <div key={i} style={{
        width: w, height: h,
        borderRadius: '0.5rem',
        background: isDark ? '#2A2118' : '#E8E0D0',
      }} />
    ))}
  </div>
);

// ── Card ──────────────────────────────────────────────────────────

const BestSellerCard: React.FC<Props> = ({ book, index, isDark }) => {
  const navigate = useNavigate();

  // ← guard must come after hooks, before any property access
  if (!book || !book.title) return null;

  const coverImage = IMAGE_MAP[book.title];
  const bg = BG_MAP[book.category_name] ?? '#1A1410';
  const isFirst = index === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ borderColor: '#E8622A50', y: -4 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.45 }}
      onClick={() => navigate('/signup')}
      style={{
        backgroundColor: isDark ? '#1A1410' : '#FFFFFF',
        border: `1px solid ${isDark ? '#2A2118' : '#E8E0D0'}`,
        borderRadius: '1.25rem',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.6rem',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Rank badge */}
      <div style={{
        position: 'absolute',
        top: '1rem',
        right: '1rem',
        width: '1.75rem',
        height: '1.75rem',
        borderRadius: '50%',
        background: isFirst ? 'linear-gradient(135deg, #FFD700, #FFA500)' : '#E8622A',
        color: 'white',
        fontSize: '0.7rem',
        fontWeight: 800,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
      }}>
        #{index + 1}
      </div>

      {/* Cover */}
      <div style={{
        height: '200px',
        borderRadius: '0.75rem',
        overflow: 'hidden',
        flexShrink: 0,
        backgroundColor: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {coverImage ? (
          <img
            src={coverImage}
            alt={book.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <span style={{ fontSize: '3.5rem' }}>📚</span>
        )}
      </div>

      {/* Category tag */}
      <span style={{
        background: '#E8622A18',
        color: '#E8622A',
        fontSize: '0.62rem',
        fontWeight: 600,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        padding: '0.22rem 0.55rem',
        borderRadius: '1rem',
        width: 'fit-content',
      }}>
        {book.category_name}
      </span>

      <p style={{
        color: isDark ? '#F5F0E8' : '#1A1410',
        fontSize: '0.92rem',
        fontWeight: 700,
        margin: 0,
        lineHeight: 1.3,
      }}>
        {book.title}
      </p>

      <p style={{ color: '#8A7968', fontSize: '0.75rem', margin: 0 }}>
        {book.author}
      </p>

      {/* Footer */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 'auto',
        paddingTop: '0.75rem',
        borderTop: `1px solid ${isDark ? '#2A2118' : '#E8E0D0'}`,
      }}>
        <div>
          <p style={{ color: '#E8622A', fontSize: '0.95rem', fontWeight: 800, margin: 0 }}>
            {formatPrice(book.price)}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.15rem' }}>
            <Star size={11} fill="#E8622A" color="#E8622A" />
            <span style={{ color: '#8A7968', fontSize: '0.7rem' }}>
              {formatRating(book.rating)}
            </span>
          </div>
        </div>
        <button
          onClick={e => { e.stopPropagation(); navigate('/signup'); }}
          style={{
            width: '2.1rem',
            height: '2.1rem',
            borderRadius: '50%',
            background: '#E8622A',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <ShoppingBag size={14} />
        </button>
      </div>
    </motion.div>
  );
};

export default BestSellerCard;