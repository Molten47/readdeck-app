import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Star, MapPin, Clock, ShoppingCart,
  Store, CheckCircle, XCircle, BookOpen, Truck,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBookDetail } from './useBookDetails';
import { useTheme }      from '../../context/ThemeContext';
import { useCartContext } from '../../context/CartContext';
import BookCover         from '../../components/dashboard/Navbar/components/BookCover';
import './bookdetails.css';

const BookDetailPage: React.FC = () => {
  const { book, availability, loading, error, selected, setSelected, selectedStore } = useBookDetail();
  const { isDark }  = useTheme();
  const { addItem } = useCartContext();
  const navigate    = useNavigate();

  const handleAddToCart = () => {
    if (!book || !selected) return;
    addItem(book.id, 1);
  };

  if (loading) return (
    <div className={`bd-page${isDark ? '' : ' bd-page--light'}`}>
      <div className="bd-skeleton-wrap">
        <div className="bd-skeleton bd-skeleton--cover" />
        <div className="bd-skeleton-info">
          <div className="bd-skeleton bd-skeleton--title" />
          <div className="bd-skeleton bd-skeleton--subtitle" />
          <div className="bd-skeleton bd-skeleton--text" />
          <div className="bd-skeleton bd-skeleton--text bd-skeleton--short" />
        </div>
      </div>
    </div>
  );

  if (error || !book) return (
    <div className={`bd-page${isDark ? '' : ' bd-page--light'}`}>
      <div className="bd-error">
        <BookOpen size={32} color="#8A7968" />
        <p>{error ?? 'Book not found'}</p>
        <button className="bd-back-btn" onClick={() => navigate('/books')}>
          Back to books
        </button>
      </div>
    </div>
  );

  return (
    <div className={`bd-page${isDark ? '' : ' bd-page--light'}`}>

      {/* ── Back ── */}
      <button className="bd-back" onClick={() => navigate(-1)}>
        <ArrowLeft size={16} />
        Back
      </button>

      <div className="bd-inner">

        {/* ── LEFT — Book info ── */}
        <motion.div
          className="bd-left"
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {/* Cover — Open Library → Google Books → emoji */}
          <div className="bd-cover">
            <BookCover
              title={book.title}
              author={book.author}
              coverUrl={book.cover_url}
              coverEmoji={book.cover_emoji}
              coverColor={book.cover_color}
              className="bd-cover__img"
            />
          </div>

          {/* Meta */}
          <div className="bd-meta">
            <span className="bd-meta__category">
              {book.category_emoji} {book.category_name}
            </span>

            <h1 className="bd-meta__title">{book.title}</h1>
            <p className="bd-meta__author">by {book.author}</p>

            <div className="bd-meta__rating">
              <Star size={14} color="#E8622A" fill="#E8622A" />
              <span className="bd-meta__rating-score">
                {Number(book.rating).toFixed(1)}
              </span>
              <span className="bd-meta__rating-count">
                ({book.total_reviews.toLocaleString()} reviews)
              </span>
            </div>

            {book.description && (
              <p className="bd-meta__desc">{book.description}</p>
            )}
          </div>
        </motion.div>

        {/* ── RIGHT — Availability + checkout ── */}
        <motion.div
          className="bd-right"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
        >

          {/* Price + CTA */}
          <div className="bd-checkout">
            <div className="bd-checkout__price-row">
              <span className="bd-checkout__price">
                ₦{selectedStore
                    ? Number(selectedStore.price).toLocaleString()
                    : Number(book.price).toLocaleString()
                  }
              </span>
              {selectedStore && (
                <span className="bd-checkout__delivery">
                  <Truck size={12} color="#8A7968" />
                  +₦{Number(selectedStore.delivery_fee).toLocaleString()} delivery
                </span>
              )}
            </div>

            <button
              className={`bd-checkout__btn${!selected || !selectedStore?.is_open ? ' bd-checkout__btn--disabled' : ''}`}
              onClick={handleAddToCart}
              disabled={!selected || !selectedStore?.is_open || !selectedStore?.in_stock}
            >
              <ShoppingCart size={16} />
              {!selected
                ? 'Select a bookstore'
                : !selectedStore?.in_stock
                ? 'Out of stock'
                : !selectedStore?.is_open
                ? 'Store is closed'
                : 'Add to cart'
              }
            </button>

            {selectedStore && (
              <p className="bd-checkout__from">
                from <strong>{selectedStore.bookstore_name}</strong>
                &nbsp;· {selectedStore.delivery_time_mins} min delivery
              </p>
            )}
          </div>

          {/* Bookstore availability list */}
          <div className="bd-stores">
            <p className="bd-stores__label">
              Available at {availability.length} bookstore{availability.length !== 1 ? 's' : ''}
            </p>

            {availability.length === 0 ? (
              <div className="bd-stores__empty">
                <XCircle size={20} color="#8A7968" />
                <span>Not available at any bookstore right now</span>
              </div>
            ) : (
              availability.map((store, i) => (
                <motion.button
                  key={store.bookstore_id}
                  className={`bd-store${selected === store.bookstore_id ? ' bd-store--selected' : ''}${!store.is_open || !store.in_stock ? ' bd-store--unavailable' : ''}`}
                  onClick={() => store.is_open && store.in_stock && setSelected(store.bookstore_id)}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.06, duration: 0.3, ease: 'easeOut' }}
                >
                  {/* Store icon */}
                  <div className="bd-store__icon">
                    <Store size={16} color="#E8622A" />
                  </div>

                  {/* Store info */}
                  <div className="bd-store__info">
                    <div className="bd-store__name-row">
                      <span className="bd-store__name">{store.bookstore_name}</span>
                      {store.is_open && store.in_stock
                        ? <CheckCircle size={13} color="#22C55E" />
                        : <XCircle     size={13} color="#6B5D50" />
                      }
                    </div>
                    <div className="bd-store__meta">
                      <span><MapPin size={10} color="#8A7968" />{store.city}</span>
                      <span><Clock  size={10} color="#8A7968" />{store.delivery_time_mins} min</span>
                      <span><Star   size={10} color="#E8622A" />{Number(store.rating).toFixed(1)}</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="bd-store__price-col">
                    <span className="bd-store__price">
                      ₦{Number(store.price).toLocaleString()}
                    </span>
                    <span className="bd-store__fee">
                      +₦{Number(store.delivery_fee).toLocaleString()} fee
                    </span>
                  </div>
                </motion.button>
              ))
            )}
          </div>

        </motion.div>
      </div>
    </div>
  );
};

export default BookDetailPage;