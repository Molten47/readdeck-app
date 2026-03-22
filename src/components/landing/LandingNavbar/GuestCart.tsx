import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';

interface Props {
  open: boolean;
  isDark: boolean;
  onSignup: () => void;
}

const GuestCart: React.FC<Props> = ({ open, isDark, onSignup }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        style={{
          position: 'absolute',
          top: 'calc(100% + 0.75rem)',
          right: 0,
          width: '16rem',
          backgroundColor: isDark ? '#1A1410' : '#FAF7F2',
          border: `1px solid ${isDark ? '#2A2118' : '#E8E0D0'}`,
          borderRadius: '1rem',
          padding: '1.5rem 1.25rem',
          boxShadow: '0 20px 50px #00000060',
          zIndex: 200,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.75rem',
          textAlign: 'center',
        }}
        initial={{ opacity: 0, y: -8, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.97 }}
        transition={{ duration: 0.15 }}
      >
        <ShoppingCart size={28} color="#2A2118" />
        <p style={{
          color: isDark ? '#F5F0E8' : '#1A1410',
          fontSize: '0.875rem',
          fontWeight: 700,
          margin: 0,
        }}>
          Your cart is empty
        </p>
        <p style={{
          color: '#8A7968',
          fontSize: '0.78rem',
          margin: 0,
          lineHeight: 1.5,
        }}>
          Sign up to start adding books to your cart
        </p>
        <button
          onClick={onSignup}
          style={{
            width: '100%',
            background: '#E8622A',
            border: 'none',
            borderRadius: '2rem',
            padding: '0.6rem',
            color: 'white',
            fontSize: '0.875rem',
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Sign up free →
        </button>
      </motion.div>
    )}
  </AnimatePresence>
);

export default GuestCart;