import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Clock, ChevronRight, Loader } from 'lucide-react';
import axios from 'axios';
import './vendor.css';

const VENDOR_API = import.meta.env.VITE_VENDOR_API_URL ?? 'http://localhost:3001';

interface VendorOrder {
  id:           string;
  status:       string;
  total_amount: number;
  item_count:   number;
  placed_at:    string;
  address:      string;
}

const STATUS_LABEL: Record<string, string> = {
  pending:    'New',
  confirmed:  'Confirmed',
  preparing:  'Preparing',
  in_transit: 'On the way',
  delivered:  'Delivered',
  cancelled:  'Cancelled',
};

const STATUS_COLOR: Record<string, string> = {
  pending:    '#E8622A',
  confirmed:  '#3B82F6',
  preparing:  '#F59E0B',
  in_transit: '#8B5CF6',
  delivered:  '#22C55E',
  cancelled:  '#6B7280',
};

const FILTERS = ['all', 'pending', 'confirmed', 'preparing', 'in_transit', 'delivered', 'cancelled'];

const VendorOrders: React.FC = () => {
  const navigate = useNavigate();
  const [orders,      setOrders]      = useState<VendorOrder[]>([]);
  const [filter,      setFilter]      = useState('all');
  const [loading,     setLoading]     = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [cursor,      setCursor]      = useState<string | null>(null);
  const [hasMore,     setHasMore]     = useState(false);
  const [error,       setError]       = useState<string | null>(null);

  const fetchOrders = useCallback((reset = false) => {
    const isMore = !reset;
    if (isMore) setLoadingMore(true); else setLoading(true);

    const params = new URLSearchParams({ limit: '20' });
    if (filter !== 'all') params.set('status', filter);
    if (isMore && cursor)  params.set('cursor', cursor);

    axios
      .get(`${VENDOR_API}/vendor/orders?${params}`, { withCredentials: true })
      .then(r => {
        const newOrders: VendorOrder[] = r.data.orders ?? [];
        setOrders(prev => reset ? newOrders : [...prev, ...newOrders]);
        setCursor(r.data.next_cursor ?? null);
        setHasMore(r.data.has_more ?? false);
      })
      .catch(() => setError('Failed to load orders'))
      .finally(() => { setLoading(false); setLoadingMore(false); });
  }, [filter, cursor]);

  useEffect(() => { fetchOrders(true); }, [filter]);

  return (
    <div className="vd-page">

      <motion.div
        className="vd-page-header"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="vd-page-title">Orders</h1>
          <p className="vd-page-sub">{orders.length} orders shown</p>
        </div>
      </motion.div>

      {/* ── Filter pills ── */}
      <div className="vd-filters">
        {FILTERS.map(f => (
          <button
            key={f}
            className={`vd-filter${filter === f ? ' vd-filter--active' : ''}`}
            onClick={() => { setOrders([]); setCursor(null); setFilter(f); }}
          >
            {f === 'all' ? 'All' : STATUS_LABEL[f]}
          </button>
        ))}
      </div>

      {/* ── List ── */}
      <div className="vd-order-list">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="vd-skeleton" />
          ))
        ) : error ? (
          <div className="vd-empty">
            <ShoppingBag size={32} color="#8A7968" />
            <p>{error}</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="vd-empty">
            <ShoppingBag size={32} color="#8A7968" />
            <p>No {filter !== 'all' ? STATUS_LABEL[filter].toLowerCase() : ''} orders</p>
          </div>
        ) : (
          orders.map((order, i) => (
            <motion.div
              key={order.id}
              className={`vd-order-card${order.status === 'pending' ? ' vd-order-card--pending' : ''}`}
              onClick={() => navigate(`/vendor/orders/${order.id}`)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03, duration: 0.3 }}
            >
              <div className="vd-order-card__left">
                {order.status === 'pending'
                  ? <div className="vd-order-card__pulse" />
                  : <div className="vd-order-card__dot" style={{ background: STATUS_COLOR[order.status] }} />
                }
                <div className="vd-order-card__info">
                  <p className="vd-order-card__id">#{order.id.slice(0, 8).toUpperCase()}</p>
                  <p className="vd-order-card__meta">
                    <Clock size={11} />
                    {new Date(order.placed_at).toLocaleDateString('en-NG', {
                      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                    })}
                    &nbsp;·&nbsp;{order.item_count} item{order.item_count !== 1 ? 's' : ''}
                  </p>
                  <p className="vd-order-card__address">{order.address}</p>
                </div>
              </div>
              <div className="vd-order-card__right">
                <span className="vd-order-card__status" style={{ color: STATUS_COLOR[order.status] }}>
                  {STATUS_LABEL[order.status]}
                </span>
                <p className="vd-order-card__amount">₦{order.total_amount.toLocaleString()}</p>
                <ChevronRight size={16} color="#8A7968" />
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* ── Load more ── */}
      {hasMore && !loading && (
        <div className="vd-load-more">
          <button
            className="vd-load-more__btn"
            onClick={() => fetchOrders(false)}
            disabled={loadingMore}
          >
            {loadingMore
              ? <Loader size={15} className="vd-spin" />
              : 'Load more orders'
            }
          </button>
        </div>
      )}

    </div>
  );
};

export default VendorOrders;