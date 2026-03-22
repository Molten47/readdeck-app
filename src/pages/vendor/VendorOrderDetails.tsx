import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Clock, MapPin, StickyNote, CheckCircle, Loader, AlertCircle } from 'lucide-react';
import axios from 'axios';
import './vendor.css';

const VENDOR_API = import.meta.env.VITE_VENDOR_API_URL ?? 'http://localhost:3001';

interface OrderItem {
  id:          string;
  book_id:     string;
  title:       string;
  author:      string;
  cover_emoji: string | null;
  cover_color: string | null;
  quantity:    number;
  unit_price:  number;
  subtotal:    number;
}

interface OrderDetail {
  id:           string;
  status:       string;
  total_amount: number;
  delivery_fee: number;
  address:      string;
  notes:        string | null;
  placed_at:    string;
  updated_at:   string;
  items:        OrderItem[];
}

// Valid next-status transitions
const NEXT_STATUS: Record<string, { label: string; next: string } | null> = {
  pending:    { label: 'Confirm Order',    next: 'confirmed'  },
  confirmed:  { label: 'Start Preparing',  next: 'preparing'  },
  preparing:  { label: 'Hand to Rider',    next: 'in_transit' },
  in_transit: { label: 'Mark Delivered',   next: 'delivered'  },
  delivered:  null,
  cancelled:  null,
};

const STATUS_LABEL: Record<string, string> = {
  pending:    'Pending',
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

const STEPS = ['pending', 'confirmed', 'preparing', 'in_transit', 'delivered'];

const VendorOrderDetail: React.FC = () => {
  const { id }   = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order,      setOrder]      = useState<OrderDetail | null>(null);
  const [loading,    setLoading]    = useState(true);
  const [updating,   setUpdating]   = useState(false);
  const [success,    setSuccess]    = useState<string | null>(null);
  const [error,      setError]      = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    axios
      .get(`${VENDOR_API}/vendor/orders/${id}`, { withCredentials: true })
      .then(r => setOrder(r.data))
      .catch(() => setError('Failed to load order'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleStatusUpdate = async (nextStatus: string) => {
    if (!order) return;
    setUpdating(true);
    setError(null);
    try {
      await axios.patch(
        `${VENDOR_API}/vendor/orders/${order.id}/status`,
        { status: nextStatus },
        { withCredentials: true },
      );
      setOrder(prev => prev ? { ...prev, status: nextStatus } : prev);
      setSuccess(`Order marked as ${STATUS_LABEL[nextStatus]}`);
      setTimeout(() => setSuccess(null), 3000);
    } catch {
      setError('Failed to update status. Try again.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return (
    <div className="vd-page">
      {Array.from({ length: 4 }).map((_, i) => <div key={i} className="vd-skeleton" />)}
    </div>
  );

  if (!order || error) return (
    <div className="vd-page vd-page--center">
      <AlertCircle size={32} color="#E8622A" />
      <p className="vd-error-text">{error ?? 'Order not found'}</p>
      <button className="vd-btn vd-btn--ghost" onClick={() => navigate('/vendor/orders')}>
        Back to orders
      </button>
    </div>
  );

  const stepIndex  = STEPS.indexOf(order.status);
  const nextAction = NEXT_STATUS[order.status];
  const subtotal   = order.total_amount - order.delivery_fee;

  return (
    <div className="vd-page">

      {/* ── Header ── */}
      <motion.div
        className="vd-page-header"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button className="vd-btn vd-btn--ghost vd-btn--icon" onClick={() => navigate('/vendor/orders')}>
            <ArrowLeft size={17} />
          </button>
          <div>
            <h1 className="vd-page-title">#{order.id.slice(0, 8).toUpperCase()}</h1>
            <p className="vd-page-sub">
              <Clock size={12} />
              {new Date(order.placed_at).toLocaleString('en-NG', {
                day: 'numeric', month: 'short', year: 'numeric',
                hour: '2-digit', minute: '2-digit',
              })}
            </p>
          </div>
        </div>
        <span
          className="vd-status-pill"
          style={{ color: STATUS_COLOR[order.status], borderColor: STATUS_COLOR[order.status] + '44', background: STATUS_COLOR[order.status] + '18' }}
        >
          {STATUS_LABEL[order.status]}
        </span>
      </motion.div>

      {/* ── Progress tracker ── */}
      {order.status !== 'cancelled' && (
        <motion.div
          className="vd-progress"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {STEPS.map((step, i) => {
            const done    = i < stepIndex;
            const current = i === stepIndex;
            return (
              <React.Fragment key={step}>
                <div className={`vd-progress__step${done ? ' vd-progress__step--done' : current ? ' vd-progress__step--active' : ''}`}>
                  <div className="vd-progress__dot">
                    {done && <CheckCircle size={14} />}
                    {current && <span className="vd-progress__pulse" />}
                  </div>
                  <span className="vd-progress__label">{STATUS_LABEL[step]}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`vd-progress__line${done ? ' vd-progress__line--done' : ''}`} />
                )}
              </React.Fragment>
            );
          })}
        </motion.div>
      )}

      {order.status === 'cancelled' && (
        <div className="vd-cancelled-banner">
          <AlertCircle size={16} /> Order was cancelled
        </div>
      )}

      <div className="vd-detail-grid">

        {/* ── Items ── */}
        <motion.section
          className="vd-card"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <h2 className="vd-card__title">Items ({order.items.length})</h2>
          <div className="vd-items">
            {order.items.map(item => (
              <div key={item.id} className="vd-item">
                <div
                  className="vd-item__cover"
                  style={{ background: item.cover_color ?? '#2A2118' }}
                >
                  {item.cover_emoji ?? '📖'}
                </div>
                <div className="vd-item__info">
                  <p className="vd-item__title">{item.title}</p>
                  <p className="vd-item__author">{item.author}</p>
                  <p className="vd-item__qty">Qty: {item.quantity} × ₦{item.unit_price.toLocaleString()}</p>
                </div>
                <p className="vd-item__subtotal">₦{item.subtotal.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ── Sidebar ── */}
        <div className="vd-detail-sidebar">

          {/* Action button */}
          {nextAction && (
            <motion.div
              className="vd-card vd-card--action"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <button
                className="vd-btn vd-btn--primary vd-btn--full"
                onClick={() => handleStatusUpdate(nextAction.next)}
                disabled={updating}
              >
                {updating
                  ? <Loader size={16} className="vd-spin" />
                  : <CheckCircle size={16} />
                }
                {nextAction.label}
              </button>
              <AnimatePresence>
                {success && (
                  <motion.p
                    className="vd-success-text"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    {success}
                  </motion.p>
                )}
                {error && (
                  <motion.p
                    className="vd-error-text"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Summary */}
          <motion.section
            className="vd-card"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <h2 className="vd-card__title">Summary</h2>
            <div className="vd-summary">
              <div className="vd-summary__row">
                <span>Subtotal</span>
                <span>₦{subtotal.toLocaleString()}</span>
              </div>
              <div className="vd-summary__row">
                <span>Delivery fee</span>
                <span>₦{order.delivery_fee.toLocaleString()}</span>
              </div>
              <div className="vd-summary__row vd-summary__row--total">
                <span>Total</span>
                <span>₦{order.total_amount.toLocaleString()}</span>
              </div>
            </div>
          </motion.section>

          {/* Delivery info */}
          <motion.section
            className="vd-card"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="vd-card__title">Delivery Info</h2>
            <div className="vd-delivery-info">
              <div className="vd-delivery-info__row">
                <MapPin size={14} color="#8A7968" />
                <p>{order.address}</p>
              </div>
              {order.notes && (
                <div className="vd-delivery-info__row">
                  <StickyNote size={14} color="#8A7968" />
                  <p>{order.notes}</p>
                </div>
              )}
            </div>
          </motion.section>

        </div>
      </div>

    </div>
  );
};

export default VendorOrderDetail;