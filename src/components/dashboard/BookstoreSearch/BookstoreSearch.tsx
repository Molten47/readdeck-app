import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBookstoreSearchUI, BOOKSTORE_IMAGES, countInArea } from './useBookstoreUI';
import './bookstoreSearch.css';

const BookstoreSearch: React.FC = () => {
  const {
    query,
    setQuery,
    suggestions,
    showSuggestions,
    setShowSuggestions,
    filteredBookstores,
    handleSelect,
    handleClear,
    containerRef,
  } = useBookstoreSearchUI();

  return (
    <section className="bs-section">
      <div className="bs-grid">

        {/* ── LEFT: Photo collage ── */}
        <motion.div
          className="bs-collage"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          {[
            { cls: 'bs-collage-item bs-collage-item--tall', img: 0 },
            { cls: 'bs-collage-item bs-collage-item--tr',   img: 1 },
            { cls: 'bs-collage-item bs-collage-item--mr',   img: 2 },
            { cls: 'bs-collage-item bs-collage-item--bl',   img: 3 },
            { cls: 'bs-collage-item bs-collage-item--br',   img: 4, badge: true },
          ].map(({ cls, img, badge }, i) => (
            <motion.div key={i} className={cls} whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}>
              <img src={BOOKSTORE_IMAGES[img]} alt="Bookstore" />
              <div className="bs-collage-overlay" />
              {badge && (
                <div className="bs-badge">
                  <span>📚</span>
                  <span>{filteredBookstores.length} stores</span>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* ── RIGHT: Search & copy ── */}
        <motion.div
          className="bs-right"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
        >
          {/* Eyebrow */}
          <div className="bs-eyebrow">
            <span>📍</span>
            <span>Find bookstores near you</span>
          </div>

          {/* Headline */}
          <div>
            <h2 className="bs-headline">
              Your next great read,<br />
              <span>delivered to your door.</span>
            </h2>
            <p className="bs-subtext">
              Search your area and we'll show you the best bookstores nearby — with fast delivery, curated picks, and real ratings.
            </p>
          </div>

          {/* Search input */}
          <div className="bs-input-wrapper" ref={containerRef}>
            <div className="bs-input-box">
              <span>🔍</span>
              <input
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setShowSuggestions(true); }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Try 'Lekki', 'Ibadan', 'Victoria Island'..."
              />
              {query
                ? <button className="bs-clear-btn" onClick={handleClear}>✕</button>
                : <button className="bs-search-btn">Search</button>
              }
            </div>

            {/* Dropdown */}
            <AnimatePresence>
              {showSuggestions && suggestions.length > 0 && (
                <motion.div
                  className="bs-dropdown"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                >
                  {suggestions.map((s, i) => (
                    <button key={i} className="bs-suggestion-btn" onClick={() => handleSelect(s)}>
                      <div className="bs-suggestion-icon">
                        {s.type === 'city' ? '🏙️' : '📍'}
                      </div>
                      <div>
                        <p className="bs-suggestion-label">{s.label}</p>
                        <p className="bs-suggestion-sub">
                          {s.type === 'city' ? 'City — all districts' : 'District'}
                          {' · '}
                          {countInArea(s, filteredBookstores)} bookstore{countInArea(s, filteredBookstores) !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <span className="bs-suggestion-arrow">→</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Stats */}
          <div className="bs-stats">
            {[
              { value: '11', label: 'Bookstores' },
              { value: '4',  label: 'Cities' },
              { value: '25min', label: 'Avg delivery' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="bs-stat-value">{stat.value}</p>
                <p className="bs-stat-label">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Results preview */}
          <AnimatePresence>
            {filteredBookstores.length > 0 && query && (
              <motion.div
                className="bs-results"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                {filteredBookstores.slice(0, 4).map((store, i) => (
                  <motion.div
                    key={store.id}
                    className="bs-result-card"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <span style={{ fontSize: '1.5rem' }}>{store.image_emoji}</span>
                    <div style={{ flex: 1 }}>
                      <p className="bs-result-name">{store.name}</p>
                      <p className="bs-result-sub">{store.district}, {store.city} · {store.delivery_time_minutes} mins</p>
                    </div>
                    <p className="bs-result-rating">⭐ {store.rating}</p>
                  </motion.div>
                ))}
                {filteredBookstores.length > 4 && (
                  <p className="bs-more">+{filteredBookstores.length - 4} more bookstores</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default BookstoreSearch;