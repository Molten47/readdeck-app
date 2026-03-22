import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Package, MapPin, Clock, Truck,
  BookOpen, AlertCircle, CheckCircle, Loader,
  Receipt, StickyNote,
} from 'lucide-react';
import { useOrderDetail, STATUS_LABELS, STATUS_COLOR, STATUS_STEPS, STATUS_STEP_LABELS } from './useOrderDetails';
import { useTheme } from '../../context/ThemeContext';
import './orderdetails.css';

const OrderDetailPage: React.FC = () => {
  const { isDark } = useTheme();
  const {
    order, loading, error,
    cancelling, cancelDone,
    handleCancel,
    currentStepIndex,
    isCancelled, canCancel,
    subtotal,
    navigate,
  } = useOrderDetail();

  const page = `ord-detail${isDark ? '' : ' ord-detail--light'}`;

  // ── Loading ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className={page}>
        <div className="ord-detail__loading">
          <Loader size={22} color="#E8622A" className="ord-detail__spin" />
          <p>Loading order...</p>
        </div>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────
  if (error || !order) {
    return (
      <div className={page}>
        <div className="ord-detail__error">
          <AlertCircle size={32} color="#EF4444" />
          <p>{error ?? 'Order not found'}</p>
          <button className="ord-detail__back-btn" onClick={() => navigate('/orders')}>
            Back to orders
          </button>
        </div>
      </div>
    );
  }

  const statusColor = STATUS_COLOR[order.status] ?? '#8A7968';
  const placedDate  = new Date(order.placed_at).toLocaleDateString('en-NG', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
  const placedTime  = new Date(order.placed_at).toLocaleTimeString('en-NG', {
    hour: '2-digit', minute: '2-digit',
  });

  return (
    <div className={page}>
      <div className="ord-detail__inner">

        {/* ── Back + Header ── */}
        <motion.div
          className="ord-detail__top"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <button className="ord-detail__back" onClick={() => navigate('/orders')}>
            <ArrowLeft size={15} />
            All orders
          </button>

          <div className="ord-detail__heading">
            <div className="ord-detail__heading-left">
              <h1 className="ord-detail__order-id">
                Order <span>#{order.id.slice(0, 8).toUpperCase()}</span>
              </h1>
              <div className="ord-detail__meta-row">
                <Clock size={12} color="#8A7968" />
                <span>{placedDate} at {placedTime}</span>
              </div>
            </div>
            <div
              className="ord-detail__status-pill"
              style={{
                color: statusColor,
                background: `${statusColor}18`,
                borderColor: `${statusColor}35`,
              }}
            >
              {STATUS_LABELS[order.status]}
            </div>
          </div>
        </motion.div>

        {/* ── Progress tracker (hidden if cancelled) ── */}
        {!isCancelled && (
          <motion.div
            className="ord-detail__tracker"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.08 }}
          >
            <div className="ord-detail__tracker-steps">
              {STATUS_STEPS.map((step, i) => {
                const done    = i < currentStepIndex;
                const active  = i === currentStepIndex;
                const pending = i > currentStepIndex;

                return (
                  <React.Fragment key={step}>
                    <div className={`ord-detail__step${active ? ' ord-detail__step--active' : done ? ' ord-detail__step--done' : ''}`}>
                      <div className="ord-detail__step-dot">
                        {done
                          ? <CheckCircle size={14} color="#22C55E" />
                          : active
                            ? <div className="ord-detail__step-dot-pulse" />
                            : <div className="ord-detail__step-dot-empty" />
                        }
                      </div>
                      <span className="ord-detail__step-label">
                        {STATUS_STEP_LABELS[step]}
                      </span>
                    </div>
                    {i < STATUS_STEPS.length - 1 && (
                      <div className={`ord-detail__step-line${done || active ? ' ord-detail__step-line--filled' : ''}`} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ── Cancelled banner ── */}
        {isCancelled && (
          <motion.div
            className="ord-detail__cancelled-banner"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.08 }}
          >
            <AlertCircle size={16} color="#EF4444" />
            <span>This order was cancelled and will not be delivered.</span>
          </motion.div>
        )}

        {/* ── Two column layout ── */}
        <div className="ord-detail__layout">

          {/* ── LEFT — Items ── */}
          <motion.div
            className="ord-detail__col"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.38, delay: 0.12 }}
          >
            <div className="ord-detail__card">
              <div className="ord-detail__card-header">
                <BookOpen size={14} color="#E8622A" />
                <span>Items ordered</span>
                <span className="ord-detail__card-count">{order.items.length}</span>
              </div>

              <div className="ord-detail__items">
                {order.items.map((item, i) => (
                  <motion.div
                    key={item.id}
                    className="ord-detail__item"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.06, duration: 0.3 }}
                  >
                    <div
                      className="ord-detail__item-cover"
                      style={{ backgroundColor: item.cover_color ?? '#2A2118' }}
                    >
                      <span className="ord-detail__item-emoji">
                        {item.cover_emoji ?? '📘'}
                      </span>
                    </div>
                    <div className="ord-detail__item-info">
                      <p className="ord-detail__item-title">{item.title}</p>
                      <p className="ord-detail__item-author">{item.author}</p>
                      <p className="ord-detail__item-qty">
                        Qty {item.quantity} × ₦{item.unit_price.toLocaleString()}
                      </p>
                    </div>
                    <span className="ord-detail__item-subtotal">
                      ₦{item.subtotal.toLocaleString()}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── RIGHT — Summary + Address ── */}
          <motion.div
            className="ord-detail__col ord-detail__col--aside"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.38, delay: 0.15 }}
          >

            {/* Order totals */}
            <div className="ord-detail__card">
              <div className="ord-detail__card-header">
                <Receipt size={14} color="#E8622A" />
                <span>Order summary</span>
              </div>

              <div className="ord-detail__totals">
                <div className="ord-detail__total-row">
                  <span>Subtotal</span>
                  <span>₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="ord-detail__total-row">
                  <span className="ord-detail__delivery-label">
                    <Truck size={11} color="#8A7968" />
                    Delivery fee
                  </span>
                  <span>₦{order.delivery_fee.toLocaleString()}</span>
                </div>
                <div className="ord-detail__total-row ord-detail__total-row--grand">
                  <span>Total</span>
                  <span className="ord-detail__grand">
                    ₦{order.total_amount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Delivery address */}
            <div className="ord-detail__card">
              <div className="ord-detail__card-header">
                <MapPin size={14} color="#E8622A" />
                <span>Delivery address</span>
              </div>
              <p className="ord-detail__address">{order.address}</p>
            </div>

            {/* Notes */}
            {order.notes && (
              <div className="ord-detail__card">
                <div className="ord-detail__card-header">
                  <StickyNote size={14} color="#E8622A" />
                  <span>Order notes</span>
                </div>
                <p className="ord-detail__notes">{order.notes}</p>
              </div>
            )}

            {/* Cancel */}
            {canCancel && (
              <button
                className="ord-detail__cancel-btn"
                onClick={handleCancel}
                disabled={cancelling}
              >
                {cancelling
                  ? <><Loader size={13} className="ord-detail__spin" /> Cancelling...</>
                  : 'Cancel order'
                }
              </button>
            )}

            {cancelDone && (
              <div className="ord-detail__cancel-done">
                <CheckCircle size={14} color="#22C55E" />
                Order cancelled successfully.
              </div>
            )}

          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default OrderDetailPage;