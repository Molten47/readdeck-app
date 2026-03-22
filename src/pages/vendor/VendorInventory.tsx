import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Search, CheckCircle, XCircle, Loader } from 'lucide-react';
import axios from 'axios';
import './vendor.css';

const VENDOR_API = import.meta.env.VITE_VENDOR_API_URL ?? 'http://localhost:3001';

interface InventoryBook {
  id:          string;
  title:       string;
  author:      string;
  price:       number;
  in_stock:    boolean;
  cover_emoji: string | null;
  cover_color: string | null;
}

const VendorInventory: React.FC = () => {
  const [books,    setBooks]    = useState<InventoryBook[]>([]);
  const [search,   setSearch]   = useState('');
  const [loading,  setLoading]  = useState(true);
  const [updating, setUpdating] = useState<string | null>(null); // book id being updated
  const [error,    setError]    = useState<string | null>(null);

  useEffect(() => {
    axios
      .get(`${VENDOR_API}/vendor/inventory`, { withCredentials: true })
      .then(r => setBooks(r.data.books ?? r.data))
      .catch(() => setError('Failed to load inventory'))
      .finally(() => setLoading(false));
  }, []);

  const toggleStock = async (book: InventoryBook) => {
    setUpdating(book.id);
    try {
      await axios.patch(
        `${VENDOR_API}/vendor/inventory/${book.id}`,
        { in_stock: !book.in_stock },
        { withCredentials: true },
      );
      setBooks(prev =>
        prev.map(b => b.id === book.id ? { ...b, in_stock: !b.in_stock } : b)
      );
    } catch {
      setError('Failed to update. Try again.');
    } finally {
      setUpdating(null);
    }
  };

  const filtered = books.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.author.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="vd-page">

      <motion.div
        className="vd-page-header"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="vd-page-title">Inventory</h1>
          <p className="vd-page-sub">{books.length} books in your store</p>
        </div>
      </motion.div>

      {/* ── Search ── */}
      <div className="vd-search-wrap">
        <Search size={15} color="#8A7968" className="vd-search__icon" />
        <input
          className="vd-search"
          placeholder="Search by title or author…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* ── Book list ── */}
      <div className="vd-inventory-list">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="vd-skeleton vd-skeleton--row" />
          ))
        ) : error ? (
          <div className="vd-empty">
            <Package size={32} color="#8A7968" />
            <p>{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="vd-empty">
            <Package size={32} color="#8A7968" />
            <p>No books found</p>
          </div>
        ) : (
          filtered.map((book, i) => (
            <motion.div
              key={book.id}
              className={`vd-inv-row${!book.in_stock ? ' vd-inv-row--out' : ''}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <div
                className="vd-inv-row__cover"
                style={{ background: book.cover_color ?? '#2A2118' }}
              >
                {book.cover_emoji ?? '📖'}
              </div>

              <div className="vd-inv-row__info">
                <p className="vd-inv-row__title">{book.title}</p>
                <p className="vd-inv-row__author">{book.author}</p>
              </div>

              <p className="vd-inv-row__price">₦{book.price.toLocaleString()}</p>

              <button
                className={`vd-stock-toggle${book.in_stock ? ' vd-stock-toggle--in' : ' vd-stock-toggle--out'}`}
                onClick={() => toggleStock(book)}
                disabled={updating === book.id}
              >
                {updating === book.id ? (
                  <Loader size={14} className="vd-spin" />
                ) : book.in_stock ? (
                  <><CheckCircle size={14} /> In stock</>
                ) : (
                  <><XCircle size={14} /> Out of stock</>
                )}
              </button>
            </motion.div>
          ))
        )}
      </div>

    </div>
  );
};

export default VendorInventory;