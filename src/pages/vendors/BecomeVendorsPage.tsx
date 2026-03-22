import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Store, MapPin, Phone, Instagram, Globe,
  CheckCircle, Clock, AlertCircle, Loader,
  Sparkles, ArrowRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBecomeVendor, STATUS_COPY } from './useBecomeVendors';
import { useTheme } from '../../context/ThemeContext';
import './Becomevendors.css';

const PERKS = [
  { icon: <Store       size={18} color="#E8622A" />, title: 'Your own storefront',  desc: 'Reach thousands of readers in your city with a dedicated page.' },
  { icon: <MapPin      size={18} color="#E8622A" />, title: 'Hyperlocal delivery',  desc: 'We handle logistics so you focus on curating great books.' },
  { icon: <Phone       size={18} color="#E8622A" />, title: 'Real-time orders',     desc: 'Get notified instantly and manage fulfilment from your phone.' },
  { icon: <CheckCircle size={18} color="#E8622A" />, title: 'Zero setup cost',      desc: 'No listing fees to get started. We only earn when you do.' },
];

const StatusBanner: React.FC<{
  status:      string;
  storeName:   string;
  submittedAt: string;
}> = ({ status, storeName, submittedAt }) => {
  const copy  = STATUS_COPY[status] ?? STATUS_COPY.pending;
  const color = status === 'approved' ? '#22C55E' : status === 'rejected' ? '#EF4444' : '#E8622A';
  return (
    <motion.div
      className="bv-status"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="bv-status__icon" style={{ color }}>
        {status === 'approved' ? <CheckCircle size={28} />
          : status === 'rejected' ? <AlertCircle size={28} />
          : <Clock size={28} />}
      </div>
      <h2 className="bv-status__label" style={{ color }}>{copy.label}</h2>
      <p className="bv-status__store">{storeName}</p>
      <p className="bv-status__desc">{copy.description}</p>
      {(status === 'pending' || status === 'reviewing') && (
        <p className="bv-status__polling">
          <span className="bv-status__dot" />
          Checking for updates…
        </p>
      )}
      <p className="bv-status__date">
        Submitted {new Date(submittedAt).toLocaleDateString('en-NG', {
          day: 'numeric', month: 'long', year: 'numeric',
        })}
      </p>
    </motion.div>
  );
};

const CelebrationModal: React.FC<{ storeName: string; onGo: () => void }> = ({ storeName, onGo }) => (
  <motion.div
    className="bv-celebration-backdrop"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <motion.div
      className="bv-celebration"
      initial={{ opacity: 0, scale: 0.85, y: 32 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 16 }}
      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
    >
      <div className="bv-celebration__sparkles">
        {[...Array(8)].map((_, i) => (
          <motion.span
            key={i}
            className="bv-celebration__spark"
            style={{ '--i': i } as React.CSSProperties}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0, 1.2, 0] }}
            transition={{ delay: i * 0.08, duration: 0.7, repeat: Infinity, repeatDelay: 1.2 }}
          />
        ))}
        <div className="bv-celebration__icon">
          <Sparkles size={28} color="#E8622A" />
        </div>
      </div>
      <h2 className="bv-celebration__title">You're in!</h2>
      <p className="bv-celebration__store">{storeName}</p>
      <p className="bv-celebration__desc">
        Your vendor account is ready. Now set up your bookstore so readers can find and order from you.
      </p>
      <motion.button
        className="bv-celebration__btn"
        onClick={onGo}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        Set up my store
        <ArrowRight size={16} />
      </motion.button>
      <p className="bv-celebration__note">
        Your navbar now shows a <strong>Vendor</strong> pill — you can always switch back to browsing as a reader.
      </p>
    </motion.div>
  </motion.div>
);

const BecomeVendorPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    form, update,
    existing,
    loading, submitting, submitted,
    error, submit,
    showCelebration, dismissCelebration,
  } = useBecomeVendor();
  const { isDark } = useTheme();

  const showStatus = !loading && (existing || submitted);

  const handleGoToSetup = () => {
    dismissCelebration();
    navigate('/vendor/setup');
  };

  return (
    <div className={`bv-page${isDark ? '' : ' bv-page--light'}`}>

      <AnimatePresence>
        {showCelebration && existing && (
          <CelebrationModal storeName={existing.store_name} onGo={handleGoToSetup} />
        )}
      </AnimatePresence>

      <div className="bv-inner">

        <motion.div
          className="bv-left"
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="bv-left__badge">
            <Store size={13} color="#E8622A" />
            Partner with Readdeck
          </div>
          <h1 className="bv-left__headline">
            Sell more books.<br />
            <span>Reach more readers.</span>
          </h1>
          <p className="bv-left__sub">
            List your bookstore on Readdeck and connect with thousands of book lovers in your city — without the overhead.
          </p>
          <div className="bv-perks">
            {PERKS.map((p, i) => (
              <motion.div
                key={p.title}
                className="bv-perk"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.08, duration: 0.35, ease: 'easeOut' }}
              >
                <div className="bv-perk__icon">{p.icon}</div>
                <div>
                  <p className="bv-perk__title">{p.title}</p>
                  <p className="bv-perk__desc">{p.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="bv-right"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
        >
          {loading ? (
            <div className="bv-loading">
              <Loader size={22} color="#8A7968" className="bv-loading__spin" />
            </div>
          ) : showStatus ? (
            <StatusBanner
              status={existing!.status}
              storeName={existing!.store_name}
              submittedAt={existing!.submitted_at}
            />
          ) : (
            <div className="bv-form">
              <h2 className="bv-form__title">Apply to list your store</h2>
              <p className="bv-form__sub">Takes about 2 minutes. We'll review within 2–3 days.</p>

              {error && (
                <div className="bv-form__error">
                  <AlertCircle size={14} color="#EF4444" />
                  {error}
                </div>
              )}

              <div className="bv-field">
                <label className="bv-field__label">Store name <span>*</span></label>
                <input className="bv-field__input" placeholder="e.g. Pages & Pages Bookstore" value={form.store_name} onChange={update('store_name')} />
              </div>
              <div className="bv-field">
                <label className="bv-field__label">Store address <span>*</span></label>
                <input className="bv-field__input" placeholder="Street address" value={form.store_address} onChange={update('store_address')} />
              </div>
              <div className="bv-row">
                <div className="bv-field">
                  <label className="bv-field__label">City <span>*</span></label>
                  <input className="bv-field__input" placeholder="Lagos, Abuja..." value={form.city} onChange={update('city')} />
                </div>
                <div className="bv-field">
                  <label className="bv-field__label">Phone <span>*</span></label>
                  <input className="bv-field__input" placeholder="080xxxxxxxx" value={form.phone} onChange={update('phone')} />
                </div>
              </div>
              <div className="bv-field">
                <label className="bv-field__label">Tell us about your store</label>
                <textarea className="bv-field__input bv-field__textarea" placeholder="What genres do you stock? What makes your store special?" value={form.description} onChange={update('description')} rows={3} />
              </div>

              <p className="bv-form__section-label">Optional</p>
              <div className="bv-row">
                <div className="bv-field">
                  <label className="bv-field__label"><Instagram size={12} color="#8A7968" /> Instagram</label>
                  <input className="bv-field__input" placeholder="@yourstorehandle" value={form.instagram} onChange={update('instagram')} />
                </div>
                <div className="bv-field">
                  <label className="bv-field__label"><Globe size={12} color="#8A7968" /> Website</label>
                  <input className="bv-field__input" placeholder="https://..." value={form.website} onChange={update('website')} />
                </div>
              </div>

              <button className="bv-form__submit" onClick={submit} disabled={submitting}>
                {submitting
                  ? <><Loader size={15} className="bv-loading__spin" /> Submitting...</>
                  : 'Submit application'
                }
              </button>
              <p className="bv-form__note">
                By submitting you agree to Readdeck's vendor terms. We'll email you with a decision.
              </p>
            </div>
          )}
        </motion.div>

      </div>
    </div>
  );
};

export default BecomeVendorPage;