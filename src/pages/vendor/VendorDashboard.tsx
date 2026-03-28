import React from 'react';
import { motion } from 'framer-motion';
import {
  ShoppingBag, Package, TrendingUp, Clock,
  ChevronRight, AlertCircle, Store, ArrowRight,
  Sun, Moon, Sparkles,
} from 'lucide-react';
import { useVendorDashboard } from './useDashboard';
import { fadeUp, STATUS_LABEL, STATUS_COLOR } from './dashNeed';
import './vendor.css';

// ── Setup Prompt ──────────────────────────────────────────────────

const SetupPrompt: React.FC<{ onSetup: () => void }> = ({ onSetup }) => (
  <motion.div
    className="vd-setup-prompt"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ type: 'tween', duration: 0.4, ease: 'easeOut' }}
  >
    <div className="vd-setup-prompt__icon">
      <Store size={28} color="#E8622A" />
    </div>
    <h2 className="vd-setup-prompt__title">One more step</h2>
    <p className="vd-setup-prompt__desc">
      Your vendor account is active, but you haven't set up your bookstore yet.
      Set it up so readers can browse and order from you.
    </p>
    <button className="vd-btn vd-btn--primary" onClick={onSetup}>
      Set up my store <ArrowRight size={15} />
    </button>
  </motion.div>
);

// ── Stat Card ─────────────────────────────────────────────────────

interface StatCardProps {
  icon:    React.ReactNode;
  label:   string;
  value:   string | number;
  accent?: boolean;
  delay:   number;
  trend?:  string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, accent, delay, trend }) => (
  <motion.div
    className={`vd-stat-card${accent ? ' vd-stat-card--accent' : ''}`}
    {...fadeUp(delay)}
  >
    <div className="vd-stat-card__top">
      <div className="vd-stat-card__icon">{icon}</div>
      {trend && <span className="vd-stat-card__trend">{trend}</span>}
    </div>
    <p className="vd-stat-card__label">{label}</p>
    <p className="vd-stat-card__value">{value}</p>
  </motion.div>
);

// ── Orders Table ──────────────────────────────────────────────────

interface OrdersTableProps {
  orders:   ReturnType<typeof useVendorDashboard>['otherOrders'];
  navigate: ReturnType<typeof useVendorDashboard>['navigate'];
}

const OrdersTable: React.FC<OrdersTableProps> = ({ orders, navigate }) => (
  <div className="vd-table-wrap">
    <table className="vd-table">
      <thead>
        <tr className="vd-table__head-row">
          <th className="vd-table__th">Order</th>
          <th className="vd-table__th vd-table__th--hide-sm">Date</th>
          <th className="vd-table__th vd-table__th--hide-md">Items</th>
          <th className="vd-table__th">Status</th>
          <th className="vd-table__th vd-table__th--right">Amount</th>
          <th className="vd-table__th vd-table__th--icon" />
        </tr>
      </thead>
      <tbody>
        {orders.slice(0, 6).map((order) => (
          <tr
            key={order.id}
            className="vd-table__row"
            onClick={() => navigate(`/vendor/orders/${order.id}`)}
          >
            <td className="vd-table__td vd-table__td--mono">
              #{order.id.slice(0, 8).toUpperCase()}
            </td>
            <td className="vd-table__td vd-table__td--muted vd-table__th--hide-sm">
              {new Date(order.placed_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}
            </td>
            <td className="vd-table__td vd-table__td--muted vd-table__th--hide-md">
              {order.item_count} item{order.item_count !== 1 ? 's' : ''}
            </td>
            <td className="vd-table__td">
              <span
                className="vd-table__status"
                style={{ color: STATUS_COLOR[order.status], borderColor: STATUS_COLOR[order.status] + '40', backgroundColor: STATUS_COLOR[order.status] + '15' }}
              >
                {STATUS_LABEL[order.status] ?? order.status}
              </span>
            </td>
            <td className="vd-table__td vd-table__td--right vd-table__td--bold">
              ₦{order.total_amount.toLocaleString()}
            </td>
            <td className="vd-table__td vd-table__td--icon">
              <ChevronRight size={14} color="#5A4E42" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ── Main Component ────────────────────────────────────────────────

const VendorDashboard: React.FC = () => {
  const {
    stats, pendingOrders, otherOrders,
    loading, error, hasBookstore,
    greeting, fetchData, navigate,
  } = useVendorDashboard();

  // ── Loading ──
  if (loading) return (
    <div className="vd-page">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="vd-skeleton" />
      ))}
    </div>
  );

  // ── Error ──
  if (error) return (
    <div className="vd-page vd-page--center">
      <AlertCircle size={32} color="#E8622A" />
      <p className="vd-error-text">{error}</p>
      <button className="vd-btn vd-btn--ghost" onClick={fetchData}>
        Try again
      </button>
    </div>
  );

  // ── No bookstore ──
  if (!hasBookstore) return (
    <div className="vd-page vd-page--center">
      <SetupPrompt onSetup={() => navigate('/vendor/setup')} />
    </div>
  );

  const GreetingIcon =
    greeting.icon === 'Moon'     ? <Moon     size={13} color="#8A7968" /> :
    greeting.icon === 'Sparkles' ? <Sparkles size={13} color="#E8622A" /> :
                                   <Sun      size={13} color="#8A7968" />;

  return (
    <div className="vd-page">

      {/* ── Header ── */}
      <motion.div className="vd-page-header" {...fadeUp(0)}>
        <div>
          <p className="vd-page-sub" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.25rem' }}>
            {GreetingIcon}
            {greeting.isHoliday
              ? 'Special day'
              : new Date().toLocaleDateString('en-NG', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
          <h1 className="vd-page-title">{greeting.main}</h1>
          <p className="vd-page-sub">{greeting.sub}</p>
        </div>
        <button className="vd-btn vd-btn--primary" onClick={() => navigate('/vendor/orders')}>
          All Orders <ChevronRight size={15} />
        </button>
      </motion.div>

      {/* ── Stat cards ── */}
      <div className="vd-stats-grid">
        <StatCard
          delay={0.04}
          icon={<ShoppingBag size={18} />}
          label="Pending"
          value={stats?.pending_orders ?? 0}
          accent
        />
        <StatCard
          delay={0.08}
          icon={<Package size={18} />}
          label="Total Orders"
          value={stats?.total_orders ?? 0}
        />
        <StatCard
          delay={0.12}
          icon={<TrendingUp size={18} />}
          label="Today's Revenue"
          value={`₦${(stats?.todays_revenue ?? 0).toLocaleString()}`}
        />
        <StatCard
          delay={0.16}
          icon={<TrendingUp size={18} />}
          label="All Time"
          value={`₦${(stats?.total_revenue ?? 0).toLocaleString()}`}
        />
      </div>

      {/* ── Pending orders ── */}
      {pendingOrders.length > 0 && (
        <motion.section className="vd-section" {...fadeUp(0.15)}>
          <div className="vd-section__header">
            <h2 className="vd-section__title">
              <span className="vd-section__badge vd-section__badge--urgent">
                {pendingOrders.length} new
              </span>
              Action Required
            </h2>
          </div>
          <div className="vd-order-list">
            {pendingOrders.map((order, i) => (
              <motion.div
                key={order.id}
                className="vd-order-card vd-order-card--pending"
                onClick={() => navigate(`/vendor/orders/${order.id}`)}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: 'tween', delay: 0.2 + i * 0.05, duration: 0.3, ease: 'easeOut' }}
              >
                <div className="vd-order-card__left">
                  <div className="vd-order-card__pulse" />
                  <div className="vd-order-card__info">
                    <p className="vd-order-card__id">#{order.id.slice(0, 8).toUpperCase()}</p>
                    <p className="vd-order-card__meta">
                      <Clock size={11} />
                      {new Date(order.placed_at).toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' })}
                      &nbsp;·&nbsp;{order.item_count} item{order.item_count !== 1 ? 's' : ''}
                    </p>
                    <p className="vd-order-card__address">{order.address}</p>
                  </div>
                </div>
                <div className="vd-order-card__right">
                  <p className="vd-order-card__amount">₦{order.total_amount.toLocaleString()}</p>
                  <ChevronRight size={16} color="#8A7968" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* ── Recent orders table ── */}
      {otherOrders.length > 0 && (
        <motion.section className="vd-section" {...fadeUp(0.2)}>
          <div className="vd-section__header">
            <h2 className="vd-section__title">Recent Orders</h2>
            <button
              className="vd-btn vd-btn--ghost"
              style={{ padding: '0.3rem 0.75rem', fontSize: '0.78rem' }}
              onClick={() => navigate('/vendor/orders')}
            >
              View all <ChevronRight size={13} />
            </button>
          </div>
          <OrdersTable orders={otherOrders} navigate={navigate} />
        </motion.section>
      )}

      {/* ── Empty state ── */}
      {pendingOrders.length === 0 && otherOrders.length === 0 && (
        <motion.div className="vd-empty" {...fadeUp(0.2)}>
          <ShoppingBag size={36} color="#3D3020" />
          <p>No orders yet — share your store link to get started</p>
        </motion.div>
      )}

    </div>
  );
};

export default VendorDashboard;