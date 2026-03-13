import React, { useState } from 'react';
import { motion } from 'framer-motion';
import '../../styles/search.css';

const categories = [
  { label: 'All', emoji: '📚' },
  { label: 'Fiction', emoji: '📖' },
  { label: 'Non-Fiction', emoji: '🧠' },
  { label: 'Textbooks', emoji: '📝' },
  { label: 'Children', emoji: '🎨' },
  { label: 'Self Help', emoji: '⭐' },
];

const SearchSection: React.FC = () => {
  const [address, setAddress] = useState('');
  const [active, setActive] = useState('All');

  return (
    <motion.section
      className="search-section"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >

      <div className="search-section__header">
        <p className="search-section__eyebrow">
          📍 Delivery near you
        </p>
        <h2 className="search-section__title">
          Bookstores near you
        </h2>
        <p className="search-section__subtitle">
          Enter your address to see available bookstores and delivery times
        </p>
      </div>

      {/* Address search bar */}
      <div className="search-bar">
        <svg className="search-bar__icon" fill="none"
          viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827
            0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <input
          className="search-bar__input"
          type="text"
          placeholder="Enter your delivery address..."
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <button className="search-bar__btn">
          Find Books
        </button>
      </div>

      {/* Category pills */}
      <div className="search-categories">
        {categories.map((cat) => (
          <button
            key={cat.label}
            className={`search-category-pill ${active === cat.label ? 'active' : ''}`}
            onClick={() => setActive(cat.label)}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

    </motion.section>
  );
};

export default SearchSection;