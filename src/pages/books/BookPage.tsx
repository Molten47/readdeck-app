import React from 'react';
import { motion } from 'framer-motion';
import { Search, ShoppingCart, Heart, BookOpen, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBooks } from './useBook';
import { useTheme } from '../../context/ThemeContext';
import { useCartContext } from '../../context/CartContext';
import BookCover from '../../components/dashboard/Navbar/components/BookCover';
import './books.css';

const BooksPage: React.FC = () => {
  const {
    books, categories, loading, loadingMore,
    search, setSearch,
    activeCategory, setActiveCategory,
    hasMore, loadMore,
  } = useBooks();
  const { isDark }  = useTheme();
  const { addItem } = useCartContext();
  const navigate    = useNavigate();

  return (
    <div className={`bk-page${isDark ? '' : ' bk-page--light'}`}>

      {/* ── Header ── */}
      <div className="bk-header">
        <div className="bk-header__inner">
          <h1 className="bk-header__title">Browse Books</h1>
          <p className="bk-header__sub">Find your next read from local bookstores</p>
          <div className="bk-search">
            <Search size={16} color="#8A7968" />
            <input
              className="bk-search__input"
              placeholder="Search titles, authors..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* ── Category tabs ── */}
      <div className="bk-cats">
        <button
          className={`bk-cat${!activeCategory ? ' bk-cat--active' : ''}`}
          onClick={() => setActiveCategory(null)}
        >
          All
        </button>
        {categories.map(c => (
          <button
            key={c.id}
            className={`bk-cat${activeCategory === c.slug ? ' bk-cat--active' : ''}`}
            onClick={() => setActiveCategory(activeCategory === c.slug ? null : c.slug)}
          >
            {c.emoji && <span style={{ marginRight: '0.3rem' }}>{c.emoji}</span>}
            {c.name}
          </button>
        ))}
      </div>

      {/* ── Grid ── */}
      <div className="bk-grid">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bk-skeleton" />
          ))
        ) : books.length === 0 ? (
          <div className="bk-empty">
            <BookOpen size={32} color="#8A7968" />
            <p>No books found</p>
          </div>
        ) : (
          <>
            {books.map((book, i) => (
              <motion.div
                key={book.id}
                className="bk-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.35, ease: 'easeOut' }}
                onClick={() => navigate(`/books/${book.id}`)}
              >
                {/* ── Cover: Open Library → Google Books → emoji ── */}
                <div className="bk-card__cover">
                  <BookCover
                    title={book.title}
                    author={book.author}
                    coverUrl={book.cover_url}
                    coverEmoji={book.cover_emoji}
                    coverColor={book.cover_color}
                    className="bk-card__cover-img"
                  />
                  <button
                    className="bk-card__wishlist"
                    onClick={e => e.stopPropagation()}
                  >
                    <Heart size={14} color="#E8622A" />
                  </button>
                </div>

                <div className="bk-card__body">
                  <p className="bk-card__title">{book.title}</p>
                  <p className="bk-card__author">{book.author}</p>
                  <div className="bk-card__footer">
                    <span className="bk-card__price">
                      ₦{Number(book.price).toLocaleString()}
                    </span>
                    <button
                      className="bk-card__add"
                      onClick={e => { e.stopPropagation(); addItem(book.id, 1); }}
                      title="Add to cart"
                    >
                      <ShoppingCart size={13} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* ── Load more ── */}
            {hasMore && (
              <div className="bk-load-more">
                <button
                  className="bk-load-more__btn"
                  onClick={loadMore}
                  disabled={loadingMore}
                >
                  {loadingMore
                    ? <><Loader size={14} className="bk-load-more__spin" /> Loading...</>
                    : 'Load more books'
                  }
                </button>
              </div>
            )}
          </>
        )}
      </div>

    </div>
  );
};

export default BooksPage;