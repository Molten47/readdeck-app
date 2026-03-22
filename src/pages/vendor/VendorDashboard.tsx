import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Package, TrendingUp, Clock, ChevronRight, AlertCircle, Store, ArrowRight, Sun, Moon, Sparkles } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './vendor.css';

const VENDOR_API = import.meta.env.VITE_VENDOR_API_URL ?? 'http://localhost:3001';

interface Stats {
  total_orders:   number;
  pending_orders: number;
  todays_revenue: number;
  total_revenue:  number;
  active_books:   number;
}

interface VendorOrder {
  id:           string;
  status:       string;
  total_amount: number;
  item_count:   number;
  placed_at:    string;
  address:      string;
}

const STATUS_LABEL: Record<string, string> = {
  pending:    'New Order',
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

const card = (delay: number) => ({
  initial:    { opacity: 0, y: 16 },
  animate:    { opacity: 1, y: 0 },
  transition: { type: 'tween' as const, delay, duration: 0.35, ease: 'easeOut' as const },
});

// ── Greeting engine ───────────────────────────────────────────────

const HOLIDAYS: Record<string, { main: string; sub: string }> = {
  '1-1':   { main: 'Happy New Year! 🎉',          sub: 'Hope your store has an amazing year ahead.' },
  '2-14':  { main: "Happy Valentine's Day 💝",     sub: 'Books make the most thoughtful gifts — your store is ready.' },
  '4-18':  { main: 'Happy Good Friday',             sub: 'A blessed long weekend to you.' },
  '4-20':  { main: 'Happy Easter! 🐣',              sub: 'Hope your weekend is joyful and your orders keep coming.' },
  '5-1':   { main: "Happy Workers' Day! 🙌",        sub: "Rest well — you've earned it." },
  '6-12':  { main: 'Happy Democracy Day!',           sub: "Celebrating Nigeria's democratic journey." },
  '10-1':  { main: 'Happy Independence Day! 🇳🇬',  sub: 'Proud to serve Nigerian readers on this special day.' },
  '12-25': { main: 'Merry Christmas! 🎄',            sub: 'Warm wishes from Readdeck to you and yours.' },
  '12-26': { main: 'Happy Boxing Day!',              sub: 'Relax — your store keeps working even when you rest.' },
  '12-31': { main: "Happy New Year's Eve! 🥂",       sub: 'Last day of the year — finish strong.' },
};

const ISLAMIC_2026: Record<string, { main: string; sub: string }> = {
  '3-30': { main: 'Eid Mubarak! 🌙',     sub: 'Wishing you and your family a blessed Eid al-Fitr.' },
  '6-6':  { main: 'Eid Mubarak! 🌙',     sub: 'May this blessed Eid al-Adha bring peace and joy.' },
  '9-4':  { main: 'Happy Maulid al-Nabi', sub: 'Peace and blessings on this holy day.' },
};

interface GreetingResult { main: string; sub: string; isHoliday: boolean; icon: 'Sun' | 'Moon' | 'Sparkles'; }

function buildGreeting(username?: string): GreetingResult {
  const now  = new Date();
  const m    = now.getMonth() + 1;
  const d    = now.getDate();
  const h    = now.getHours();
  const key  = `${m}-${d}`;
  const name = username ? `, ${username.split(' ')[0]}` : '';

  const holiday = HOLIDAYS[key] ?? ISLAMIC_2026[key];
  if (holiday) return { ...holiday, isHoliday: true, icon: 'Sparkles' as const };

  if (h >= 5  && h < 12) return { main: `Good morning${name}`,   sub: "Here's what needs your attention today.",       isHoliday: false, icon: 'Sun'  as const };
  if (h >= 12 && h < 17) return { main: `Good afternoon${name}`, sub: 'Stay on top of your orders.',                   isHoliday: false, icon: 'Sun'  as const };
  if (h >= 17 && h < 21) return { main: `Good evening${name}`,   sub: 'Wrapping up for the day? Check your orders.',   isHoliday: false, icon: 'Moon' as const };
  return                         { main: `You're up late${name}`, sub: 'Night shift — your dashboard is always ready.', isHoliday: false, icon: 'Moon' as const };
}

// ── Setup prompt ──────────────────────────────────────────────────

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
      Set up my store
      <ArrowRight size={15} />
    </button>
  </motion.div>
);

// ── Main component ────────────────────────────────────────────────

const VendorDashboard: React.FC = () => {
  const navigate     = useNavigate();
  const { user }     = useAuth();
  const greeting     = useMemo(() => buildGreeting(user?.username), [user?.username]);

  const [stats,        setStats]        = useState<Stats | null>(null);
  const [orders,       setOrders]       = useState<VendorOrder[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState<string | null>(null);
  const [hasBookstore, setHasBookstore] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get(`${VENDOR_API}/vendor/stats`,           { withCredentials: true }),
      axios.get(`${VENDOR_API}/vendor/orders?limit=10`, { withCredentials: true }),
    ])
      .then(([statsRes, ordersRes]) => {
        const s: Stats = ordersRes.data.stats ?? statsRes.data;
        setStats(s);

        const bookstoreExists =
          statsRes.data.has_bookstore !== undefined
            ? statsRes.data.has_bookstore
            : statsRes.data.bookstore_id != null;
        setHasBookstore(bookstoreExists);

        const all: VendorOrder[] = ordersRes.data.orders ?? [];
        all.sort((a, b) => {
          if (a.status === 'pending' && b.status !== 'pending') return -1;
          if (b.status === 'pending' && a.status !== 'pending') return 1;
          return new Date(b.placed_at).getTime() - new Date(a.placed_at).getTime();
        });
        setOrders(all);
      })
      .catch((err) => {
        if (err?.response?.status === 404 || err?.response?.status === 403) {
          setHasBookstore(false);
        } else {
          setError('Failed to load dashboard data');
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="vd-page">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="vd-skeleton" />
      ))}
    </div>
  );

  if (error) return (
    <div className="vd-page vd-page--center">
      <AlertCircle size={32} color="#E8622A" />
      <p className="vd-error-text">{error}</p>
    </div>
  );

  if (!hasBookstore) return (
    <div className="vd-page vd-page--center">
      <SetupPrompt onSetup={() => navigate('/vendor/setup')} />
    </div>
  );

  const pendingOrders = orders.filter(o => o.status === 'pending');
  const otherOrders   = orders.filter(o => o.status !== 'pending');

  const GreetingIcon = greeting.icon === 'Moon'
    ? <Moon     size={13} color="#8A7968" />
    : greeting.icon === 'Sparkles'
    ? <Sparkles size={13} color="#E8622A" />
    : <Sun      size={13} color="#8A7968" />;

  return (
    <div className="vd-page">

      {/* ── Header with greeting ── */}
      <motion.div className="vd-page-header" {...card(0)}>
        <div>
          <p className="vd-page-sub" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.25rem' }}>
            {GreetingIcon}
            {greeting.isHoliday ? 'Special day' : new Date().toLocaleDateString('en-NG', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
          <h1 className="vd-page-title">{greeting.main}</h1>
          <p className="vd-page-sub">{greeting.sub}</p>
        </div>
        <button className="vd-btn vd-btn--primary" onClick={() => navigate('/vendor/orders')}>
          All Orders
          <ChevronRight size={15} />
        </button>
      </motion.div>

      {/* ── Stats ── */}
      <div className="vd-stats-grid">
        {[
          { icon: ShoppingBag, label: 'Pending',         value: stats?.pending_orders ?? 0,                           accent: true  },
          { icon: Package,     label: 'Total Orders',     value: stats?.total_orders ?? 0,                             accent: false },
          { icon: TrendingUp,  label: "Today's Revenue",  value: `₦${(stats?.todays_revenue ?? 0).toLocaleString()}`,  accent: false },
          { icon: TrendingUp,  label: 'All Time',         value: `₦${(stats?.total_revenue ?? 0).toLocaleString()}`,   accent: false },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            className={`vd-stat-card${s.accent ? ' vd-stat-card--accent' : ''}`}
            {...card(0.05 * i)}
          >
            <div className="vd-stat-card__icon"><s.icon size={18} /></div>
            <p className="vd-stat-card__label">{s.label}</p>
            <p className="vd-stat-card__value">{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* ── Pending orders ── */}
      {pendingOrders.length > 0 && (
        <motion.section className="vd-section" {...card(0.15)}>
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

      {/* ── Recent orders ── */}
      {otherOrders.length > 0 && (
        <motion.section className="vd-section" {...card(0.2)}>
          <div className="vd-section__header">
            <h2 className="vd-section__title">Recent Orders</h2>
          </div>
          <div className="vd-order-list">
            {otherOrders.slice(0, 6).map((order, i) => (
              <motion.div
                key={order.id}
                className="vd-order-card"
                onClick={() => navigate(`/vendor/orders/${order.id}`)}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'tween', delay: 0.25 + i * 0.04, duration: 0.3, ease: 'easeOut' }}
              >
                <div className="vd-order-card__left">
                  <div className="vd-order-card__dot" style={{ background: STATUS_COLOR[order.status] }} />
                  <div className="vd-order-card__info">
                    <p className="vd-order-card__id">#{order.id.slice(0, 8).toUpperCase()}</p>
                    <p className="vd-order-card__meta">
                      <Clock size={11} />
                      {new Date(order.placed_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}
                      &nbsp;·&nbsp;{order.item_count} item{order.item_count !== 1 ? 's' : ''}
                    </p>
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
            ))}
          </div>
        </motion.section>
      )}

      {orders.length === 0 && (
        <motion.div className="vd-empty" {...card(0.2)}>
          <ShoppingBag size={36} color="#3D3020" />
          <p>No orders yet — share your store link to get started</p>
        </motion.div>
      )}

    </div>
  );
};

export default VendorDashboard;