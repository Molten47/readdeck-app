import React from 'react';
import { motion } from 'framer-motion';
import { Package, ChevronRight, Clock, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useOrders, STATUS_LABELS, STATUS_COLOR } from './useOrders';
import { useTheme } from '../../context/ThemeContext';
import './orders.css';

const FILTERS = ['pending', 'confirmed', 'preparing', 'in_transit', 'delivered', 'cancelled'];

const OrdersPage: React.FC = () => {
  const {
    orders, total, loading, loadingMore, error,
    filter, setFilter,
    hasMore, loadMore,
  } = useOrders();
  const { isDark } = useTheme();
  const navigate   = useNavigate();

  return (
    <div className={`ord-page${isDark ? '' : ' ord-page--light'}`}>

      {/* ── Header ── */}
      <div className="ord-header">
        <div className="ord-header__inner">
          <h1 className="ord-header__title">Your Orders</h1>
          <p className="ord-header__sub">
            {total > 0
              ? `${total} order${total !== 1 ? 's' : ''} · Track deliveries and view history`
              : 'Track deliveries and view order history'
            }
          </p>
        </div>
      </div>

      {/* ── Filter Pills ── */}
      <div className="ord-filters">
        <button
          className={`ord-filter${!filter ? ' ord-filter--active' : ''}`}
          onClick={() => setFilter(null)}
        >
          All
        </button>
        {FILTERS.map(f => (
          <button
            key={f}
            className={`ord-filter${filter === f ? ' ord-filter--active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {STATUS_LABELS[f]}
          </button>
        ))}
      </div>

      {/* ── List ── */}
      <div className="ord-list">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="ord-skeleton" />
          ))
        ) : error ? (
          <div className="ord-empty">
            <Package size={32} color="#8A7968" />
            <p>{error}</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="ord-empty">
            <Package size={32} color="#8A7968" />
            <p>No orders yet</p>
            <button className="ord-empty__cta" onClick={() => navigate('/books')}>
              Browse books
            </button>
          </div>
        ) : (
          <>
            {orders.map((order, i) => (
              <motion.div
                key={order.id}
                className="ord-card"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.3, ease: 'easeOut' }}
                onClick={() => navigate(`/orders/${order.id}`)}
              >
                <div className="ord-card__left">
                  <div className="ord-card__icon">
                    <Package size={18} color="#E8622A" />
                  </div>
                  <div className="ord-card__info">
                    <p className="ord-card__id">
                      Order #{order.id.slice(0, 8).toUpperCase()}
                    </p>
                    <p className="ord-card__meta">
                      <Clock size={11} color="#8A7968" />
                      {new Date(order.placed_at).toLocaleDateString('en-NG', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                      &nbsp;·&nbsp;{order.item_count} item{order.item_count !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                <div className="ord-card__right">
                  <span
                    className="ord-card__status"
                    style={{ color: STATUS_COLOR[order.status] }}
                  >
                    {STATUS_LABELS[order.status]}
                  </span>
                  <p className="ord-card__amount">
                    ₦{order.total_amount.toLocaleString()}
                  </p>
                  <ChevronRight size={16} color="#8A7968" />
                </div>
              </motion.div>
            ))}

            {/* ── Load more ── */}
            {hasMore && (
              <div className="ord-load-more">
                <button
                  className="ord-load-more__btn"
                  onClick={loadMore}
                  disabled={loadingMore}
                >
                  {loadingMore
                    ? <><Loader size={14} className="ord-load-more__spin" /> Loading...</>
                    : 'Load more orders'
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

export default OrdersPage;