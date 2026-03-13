import React from 'react';
import { motion } from 'framer-motion';

const books = [
  { emoji: '📚', x: -120, y: -80, delay: 0 },
  { emoji: '📖', x: 120, y: -60, delay: 0.3 },
  { emoji: '🏠', x: -100, y: 80, delay: 0.6 },
  { emoji: '📦', x: 110, y: 70, delay: 0.9 },
  { emoji: '⭐', x: -60, y: -130, delay: 1.2 },
];

const PhoneMockup: React.FC = () => (
  <div style={{ position: 'relative', width: '360px', height: '650px' }}>

    {/* Floating icons around phone */}
    {books.map((book, i) => (
      <motion.div
        key={i}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          fontSize: '1.75rem',
          zIndex: 2,
        }}
        animate={{
          x: [book.x - 8, book.x + 8, book.x - 8],
          y: [book.y - 8, book.y + 8, book.y - 8],
          rotate: [-5, 5, -5],
        }}
        transition={{
          duration: 3 + book.delay,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: book.delay,
        }}
      >
        {book.emoji}
      </motion.div>
    ))}

    {/* Phone frame */}
    <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        whileHover={{
            scale: 1.03,
            boxShadow: '0 40px 80px #00000080, 0 0 40px #E8622A40, 0 0 80px #E8622A20',
            borderColor: '#E8622A',
            transition: { duration: 0.3 },
        }}
        whileTap={{
            scale: 0.98,
            boxShadow: '0 20px 40px #00000080, 0 0 60px #E8622A60',
            transition: { duration: 0.15 },
        }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#1A1410',
            borderRadius: '2.5rem',
            border: '2px solid #2A2118',
            overflow: 'hidden',
            position: 'relative',
            cursor: 'pointer',
            boxShadow: '0 40px 80px #00000080, 0 0 0 1px #2A2118',
        }}
    >
      {/* Phone notch */}
      <div style={{
        position: 'absolute',
        top: '1rem',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '80px',
        height: '24px',
        backgroundColor: '#0F0C09',
        borderRadius: '1rem',
        zIndex: 10,
      }} />

      {/* App screen content */}
      <div style={{
        padding: '3.5rem 1.25rem 1.25rem',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
      }}>

        {/* App header */}
        <div style={{ paddingTop: '0.5rem' }}>
          <p style={{ color: '#8A7968', fontSize: '0.7rem' }}>
            Deliver to
          </p>
          <p style={{
            color: '#F5F0E8', fontSize: '0.85rem',
            fontWeight: 600, display: 'flex',
            alignItems: 'center', gap: '0.25rem',
          }}>
            📍 123 Reader's Lane
          </p>
        </div>

        {/* Search bar mock */}
        <div style={{
          backgroundColor: '#0F0C09',
          borderRadius: '0.5rem',
          padding: '0.6rem 0.75rem',
          color: '#8A7968',
          fontSize: '0.75rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
        }}>
          🔍 Search for books...
        </div>

        {/* Banner */}
        <motion.div
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            backgroundColor: '#E8622A',
            borderRadius: '0.75rem',
            padding: '1rem',
            color: 'white',
          }}
        >
          <p style={{ fontSize: '0.7rem', opacity: 0.85 }}>
            📦 Free delivery today
          </p>
          <p style={{ fontSize: '0.9rem', fontWeight: 700, marginTop: '0.2rem' }}>
            Books at your door
          </p>
        </motion.div>

        {/* Book cards */}
        {[
          { title: 'Atomic Habits', author: 'James Clear', price: '₦4,500', emoji: '📘' },
          { title: 'Deep Work', author: 'Cal Newport', price: '₦3,800', emoji: '📗' },
          { title: 'The Alchemist', author: 'Paulo Coelho', price: '₦2,900', emoji: '📙' },
        ].map((book, i) => (
          <motion.div
            key={i}
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 + i * 0.15, duration: 0.5 }}
            style={{
              backgroundColor: '#0F0C09',
              borderRadius: '0.6rem',
              padding: '0.6rem 0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
            }}
          >
            <span style={{ fontSize: '1.5rem' }}>{book.emoji}</span>
            <div style={{ flex: 1 }}>
              <p style={{
                color: '#F5F0E8', fontSize: '0.75rem',
                fontWeight: 600, lineHeight: 1.2,
              }}>
                {book.title}
              </p>
              <p style={{ color: '#8A7968', fontSize: '0.65rem' }}>
                {book.author}
              </p>
            </div>
            <p style={{
              color: '#E8622A', fontSize: '0.75rem',
              fontWeight: 700,
            }}>
              {book.price}
            </p>
          </motion.div>
        ))}

        {/* Delivery animation */}
        <div style={{
          marginTop: 'auto',
          backgroundColor: '#0F0C09',
          borderRadius: '0.6rem',
          padding: '0.6rem 0.75rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          <motion.span
            animate={{ x: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ fontSize: '1.1rem' }}
          >
            🚗
          </motion.span>
          <div>
            <p style={{ color: '#F5F0E8', fontSize: '0.7rem', fontWeight: 600 }}>
              Your order is on the way
            </p>
            <p style={{ color: '#E8622A', fontSize: '0.65rem' }}>
              Arriving in 25 mins
            </p>
          </div>
        </div>

      </div>
    </motion.div>
  </div>
);

export default PhoneMockup;