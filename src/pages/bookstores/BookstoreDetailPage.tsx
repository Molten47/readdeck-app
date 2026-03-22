import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Star, MapPin, Clock, Truck,
  BookOpen, Search, Store, CheckCircle, XCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBookstoreDetail } from './useBookstoreDetails';
import { useTheme } from '../../context/ThemeContext';
import BookCover from '../../components/dashboard/Navbar/components/BookCover';
import './bookstoredetails.css';

const BookstoreDetailPage: React.FC = () => {
  const {
    store, books, categories, loading, error,
    search, setSearch, activeCategory, setActiveCategory,
  } = useBookstoreDetail();
  const { isDark } = useTheme();
  const navigate   = useNavigate();

  if (loading) return (
    <div className={`bsd-page${isDark ? '' : ' bsd-page--light'}`}>
      <div className="bsd-skeleton-header" />
      <div className="bsd-grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bsd-skeleton-card" />
        ))}
      </div>
    </div>
  );

  if (error || !store) return (
    <div className={`bsd-page${isDark ? '' : ' bsd-page--light'}`}>
      <div className="bsd-error">
        <Store size={32} color="#8A7968" />
        <p>{error ?? 'Bookstore not found'}</p>
        <button className="bsd-back-btn" onClick={() => navigate('/bookstores')}>
          Back to bookstores
        </button>
      </div>
    </div>
  );

  return (
    <div className={`bsd-page${isDark ? '' : ' bsd-page--light'}`}>

      {/* ── Back ── */}
      <button className="bsd-back" onClick={() => navigate(-1)}>
        <ArrowLeft size={16} />
        Back
      </button>

      {/* ── Store header ── */}
      <motion.div
        className="bsd-header"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        <div className="bsd-header__cover">
          <span className="bsd-header__emoji">{store.image_emoji}</span>
        </div>

        <div className="bsd-header__info">
          <div className="bsd-header__top">
            <h1 className="bsd-header__name">{store.name}</h1>
            <span className={`bsd-header__status${store.is_open ? ' bsd-header__status--open' : ' bsd-header__status--closed'}`}>
              {store.is_open
                ? <><CheckCircle size={12} /> Open</>
                : <><XCircle     size={12} /> Closed</>
              }
            </span>
          </div>

          <div className="bsd-header__meta">
            <span className="bsd-header__meta-item">
              <MapPin size={13} color="#8A7968" />
              {store.address}, {store.district}, {store.city}
            </span>
            <span className="bsd-header__meta-item">
              <Star size={13} color="#E8622A" fill="#E8622A" />
              {Number(store.rating).toFixed(1)}
              <span className="bsd-header__meta-muted">
                ({store.total_reviews.toLocaleString()} reviews)
              </span>
            </span>
            <span className="bsd-header__meta-item">
              <Clock size={13} color="#8A7968" />
              {store.delivery_time_minutes} min delivery
            </span>
            <span className="bsd-header__meta-item">
              <Truck size={13} color="#8A7968" />
              ₦{Number(store.delivery_fee).toLocaleString()} delivery fee
            </span>
          </div>

          <div className="bsd-header__order-note">
            Minimum order: <strong>₦{Number(store.minimum_order).toLocaleString()}</strong>
          </div>
        </div>
      </motion.div>

      {/* ── Books section ── */}
      <div className="bsd-books-section">

        {/* Search + category filters */}
        <div className="bsd-controls">
          <div className="bsd-search">
            <Search size={15} color="#8A7968" />
            <input
              className="bsd-search__input"
              placeholder="Search books in this store..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="bsd-cats">
            <button
              className={`bsd-cat${!activeCategory ? ' bsd-cat--active' : ''}`}
              onClick={() => setActiveCategory(null)}
            >
              All
            </button>
            {categories.map(c => (
              <button
                key={c.slug}
                className={`bsd-cat${activeCategory === c.slug ? ' bsd-cat--active' : ''}`}
                onClick={() => setActiveCategory(activeCategory === c.slug ? null : c.slug)}
              >
                {c.emoji && <span style={{ marginRight: '0.25rem' }}>{c.emoji}</span>}
                {c.name}
              </button>
            ))}
          </div>
        </div>

        <p className="bsd-books-count">
          {books.length} book{books.length !== 1 ? 's' : ''} available
        </p>

        {/* Books grid — clicking goes to book detail with this store pre-selected */}
        {books.length === 0 ? (
          <div className="bsd-empty">
            <BookOpen size={28} color="#8A7968" />
            <p>No books found</p>
          </div>
        ) : (
          <div className="bsd-grid">
            {books.map((book, i) => (
              <motion.div
                key={book.id}
                className="bsd-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.32, ease: 'easeOut' }}
                onClick={() => navigate(`/books/${book.id}?store=${store.id}`)}
              >
                {/* Cover */}
                <div className="bsd-card__cover">
                  <BookCover
                    title={book.title}
                    author={book.author}
                    coverUrl={book.cover_url}
                    coverEmoji={book.cover_emoji}
                    coverColor={book.cover_color}
                    className="bsd-card__img"
                  />
                  {!book.in_stock && (
                    <div className="bsd-card__out-badge">Out of stock</div>
                  )}
                </div>

                {/* Body */}
                <div className="bsd-card__body">
                  <p className="bsd-card__title">{book.title}</p>
                  <p className="bsd-card__author">{book.author}</p>
                  <div className="bsd-card__footer">
                    <span className="bsd-card__price">
                      ₦{Number(book.price).toLocaleString()}
                    </span>
                    <div className="bsd-card__rating">
                      <Star size={10} color="#E8622A" fill="#E8622A" />
                      <span>{Number(book.rating).toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default BookstoreDetailPage;