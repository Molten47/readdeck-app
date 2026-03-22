import React from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Clock, Star, Store } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBookstores } from './useBookstore';
import { useTheme } from '../../context/ThemeContext';
import './Bookstore.css';

const BookstoresPage: React.FC = () => {
  const { bookstores, loading, search, setSearch } = useBookstores();
  const { isDark } = useTheme();
  const navigate   = useNavigate();

  return (
    <div className={`bs-page${isDark ? '' : ' bs-page--light'}`}>

      {/* ── Header ── */}
      <div className="bs-header">
        <div className="bs-header__inner">
          <h1 className="bs-header__title">Bookstores</h1>
          <p className="bs-header__sub">Local stores delivering to your door</p>

          <div className="bs-search">
            <Search size={16} color="#8A7968" />
            <input
              className="bs-search__input"
              placeholder="Search by name or city..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="bs-grid">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <div key={i} className="bs-skeleton" />)
          : bookstores.map((store, i) => (
              <motion.div
                key={store.id}
                className="bs-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.35, ease: 'easeOut' }}
                onClick={() => navigate(`/bookstores/${store.id}`)}
              >
                <div className="bs-card__cover">
                  <div className="bs-card__cover-placeholder">
                    <span style={{ fontSize: '2.5rem' }}>{store.image_emoji}</span>
                  </div>
                  <span className={`bs-card__badge${store.is_open ? '' : ' bs-card__badge--closed'}`}>
                    {store.is_open ? 'Open' : 'Closed'}
                  </span>
                </div>

                <div className="bs-card__body">
                  <p className="bs-card__name">{store.name}</p>
                  <div className="bs-card__meta">
                    <span className="bs-card__meta-item">
                      <MapPin size={11} color="#8A7968" />
                      {store.city}
                    </span>
                    <span className="bs-card__meta-item">
                      <Clock size={11} color="#8A7968" />
                      {store.delivery_time_minutes} min
                    </span>
                    <span className="bs-card__meta-item">
                      <Star size={11} color="#E8622A" fill="#E8622A" />
                      {Number(store.rating).toFixed(1)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))
        }
      </div>

    </div>
  );
};

export default BookstoresPage;