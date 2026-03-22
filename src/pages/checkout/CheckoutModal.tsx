import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, ChevronRight, ChevronLeft, MapPin, CheckCircle,
  Package, Loader, ShoppingBag, Truck, Plus, Star,
} from 'lucide-react';
import type { CartGroup } from '../../context/CartContext';
import { useCheckout } from './useCheckout';
import { useTheme } from '../../context/ThemeContext';
import BookCover from '../../components/dashboard/Navbar/components/BookCover';
import './checkoutModal.css';

interface CheckoutModalProps {
  group:   CartGroup;
  onClose: () => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ group, onClose }) => {
  const { isDark } = useTheme();
  const {
    stage, setStage,
    selected, toggleItem, toggleAll,
    selectedItems, selectedSubtotal,
    deliveryFee, grandTotal,
    addresses, selectedAddressId, setSelectedAddressId,
    showNewForm, setShowNewForm,
    newLabel, setNewLabel,
    newAddress, setNewAddress,
    newCity, setNewCity,
    newPhone, setNewPhone,
    saveNewAddress, setSaveNewAddress,
    resolvedAddress,
    notes, setNotes,
    submitting, error,
    orderResult,
    canProceedToAddress, canConfirm,
    handleConfirm,
    handleTrackOrder,
    handleContinueShopping,
  } = useCheckout(group, onClose);

  const themeClass = isDark ? '' : ' checkout-modal--light';

  return (
    <>
      {/* ── Backdrop ── */}
      <motion.div
        className="checkout-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={stage !== 'success' ? onClose : undefined}
      />

      {/* ── Modal ── */}
      <motion.div
        className={`checkout-modal${themeClass}`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 35 }}
      >
        {/* ── Header ── */}
        {stage !== 'success' && (
          <div className="checkout-modal__header">
            <div className="checkout-modal__header-left">
              {stage !== 'select' && (
                <button
                  className="checkout-modal__back"
                  onClick={() => setStage(stage === 'confirm' ? 'address' : 'select')}
                >
                  <ChevronLeft size={16} />
                </button>
              )}
              <div>
                <p className="checkout-modal__store">{group.bookstore_name}</p>
                <p className="checkout-modal__stage-label">
                  {stage === 'select'  && 'Select items to order'}
                  {stage === 'address' && 'Delivery address'}
                  {stage === 'confirm' && 'Confirm your order'}
                </p>
              </div>
            </div>
            <button className="checkout-modal__close" onClick={onClose}>
              <X size={16} />
            </button>
          </div>
        )}

        {/* ── Progress dots ── */}
        {stage !== 'success' && (
          <div className="checkout-modal__progress">
            {(['select', 'address', 'confirm'] as const).map((s, i) => (
              <div
                key={s}
                className={`checkout-modal__dot${
                  s === stage ? ' checkout-modal__dot--active' :
                  ['select', 'address', 'confirm'].indexOf(stage) > i
                    ? ' checkout-modal__dot--done' : ''
                }`}
              />
            ))}
          </div>
        )}

        {/* ════ STAGE 1 — Select items ════ */}
        {stage === 'select' && (
          <div className="checkout-modal__body">
            <div className="checkout-modal__select-all">
              <label className="checkout-modal__checkbox-row">
                <input
                  type="checkbox"
                  checked={selected.size === group.items.length}
                  onChange={toggleAll}
                  className="checkout-modal__checkbox"
                />
                <span>Select all ({group.items.length} items)</span>
              </label>
            </div>

            <div className="checkout-modal__items">
              {group.items.map(item => (
                <label key={item.id} className="checkout-modal__item">
                  <input
                    type="checkbox"
                    checked={selected.has(item.id)}
                    onChange={() => toggleItem(item.id)}
                    className="checkout-modal__checkbox"
                  />
                  <div
                    className="checkout-modal__item-cover"
                    style={{ backgroundColor: item.cover_color ?? '#2A2118' }}
                  >
                    <BookCover
                      title={item.title}
                      author={item.author}
                      coverUrl={item.cover_url}
                      coverEmoji={item.cover_emoji}
                      coverColor={item.cover_color}
                      imgStyle={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '0.35rem' }}
                    />
                  </div>
                  <div className="checkout-modal__item-info">
                    <p className="checkout-modal__item-title">{item.title}</p>
                    <p className="checkout-modal__item-author">{item.author}</p>
                    <p className="checkout-modal__item-qty">Qty: {item.quantity}</p>
                  </div>
                  <span className="checkout-modal__item-price">
                    ₦{item.subtotal.toLocaleString()}
                  </span>
                </label>
              ))}
            </div>

            <div className="checkout-modal__footer">
              <div className="checkout-modal__subtotal">
                <span>{selected.size} item{selected.size !== 1 ? 's' : ''} selected</span>
                <span className="checkout-modal__subtotal-price">
                  ₦{selectedSubtotal.toLocaleString()}
                </span>
              </div>
              <button
                className="checkout-modal__next-btn"
                disabled={!canProceedToAddress}
                onClick={() => setStage('address')}
              >
                Continue to address
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ════ STAGE 2 — Address ════ */}
        {stage === 'address' && (
          <div className="checkout-modal__body">

            {/* ── Saved addresses ── */}
            {addresses.length > 0 && !showNewForm && (
              <div className="checkout-modal__address-list">
                {addresses.map(addr => (
                  <button
                    key={addr.id}
                    className={`checkout-modal__address-card${
                      selectedAddressId === addr.id ? ' checkout-modal__address-card--selected' : ''
                    }`}
                    onClick={() => {
                      setSelectedAddressId(addr.id);
                      setShowNewForm(false);
                    }}
                  >
                    <div className="checkout-modal__address-card-left">
                      <div className="checkout-modal__address-label-row">
                        <span className="checkout-modal__address-label-badge">
                          {addr.label}
                        </span>
                        {addr.is_default && (
                          <span className="checkout-modal__address-default-badge">
                            <Star size={9} />
                            Default
                          </span>
                        )}
                      </div>
                      <p className="checkout-modal__address-text">{addr.address}</p>
                      <p className="checkout-modal__address-city-phone">
                        {addr.city} · {addr.phone}
                      </p>
                    </div>
                    <div className={`checkout-modal__address-radio${
                      selectedAddressId === addr.id ? ' checkout-modal__address-radio--selected' : ''
                    }`} />
                  </button>
                ))}

                <button
                  className="checkout-modal__add-address-btn"
                  onClick={() => {
                    setShowNewForm(true);
                    setSelectedAddressId(null);
                  }}
                >
                  <Plus size={14} />
                  Add new address
                </button>
              </div>
            )}

            {/* ── New address form ── */}
            {(showNewForm || addresses.length === 0) && (
              <div className="checkout-modal__new-address-form">
                {addresses.length > 0 && (
                  <button
                    className="checkout-modal__back-to-saved"
                    onClick={() => {
                      setShowNewForm(false);
                      setSelectedAddressId(addresses.find(a => a.is_default)?.id ?? addresses[0]?.id ?? null);
                    }}
                  >
                    <ChevronLeft size={13} />
                    Back to saved addresses
                  </button>
                )}

                <div className="checkout-modal__field-row">
                  <div className="checkout-modal__field">
                    <label className="checkout-modal__label">Label</label>
                    <input
                      className="checkout-modal__input"
                      placeholder="Home, Office..."
                      value={newLabel}
                      onChange={e => setNewLabel(e.target.value)}
                    />
                  </div>
                  <div className="checkout-modal__field">
                    <label className="checkout-modal__label">City <span>*</span></label>
                    <input
                      className="checkout-modal__input"
                      placeholder="Lagos"
                      value={newCity}
                      onChange={e => setNewCity(e.target.value)}
                    />
                  </div>
                </div>

                <div className="checkout-modal__field">
                  <label className="checkout-modal__label">
                    <MapPin size={13} color="#8A7968" />
                    Delivery address <span>*</span>
                  </label>
                  <textarea
                    className="checkout-modal__input checkout-modal__textarea"
                    placeholder="Street address, area, landmarks..."
                    value={newAddress}
                    onChange={e => setNewAddress(e.target.value)}
                    rows={2}
                    autoFocus
                  />
                </div>

                <div className="checkout-modal__field">
                  <label className="checkout-modal__label">
                    Phone number for rider <span>*</span>
                  </label>
                  <input
                    className="checkout-modal__input"
                    placeholder="08012345678"
                    value={newPhone}
                    onChange={e => setNewPhone(e.target.value)}
                  />
                </div>

                <label className="checkout-modal__save-row">
                  <input
                    type="checkbox"
                    className="checkout-modal__checkbox"
                    checked={saveNewAddress}
                    onChange={e => setSaveNewAddress(e.target.checked)}
                  />
                  <span>Save this address for future orders</span>
                </label>
              </div>
            )}

            {/* ── Notes ── */}
            <div className="checkout-modal__field" style={{ marginTop: '1rem' }}>
              <label className="checkout-modal__label">Order notes (optional)</label>
              <input
                className="checkout-modal__input"
                placeholder="Any special instructions?"
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
            </div>

            <div className="checkout-modal__footer">
              <button
                className="checkout-modal__next-btn"
                disabled={!canConfirm}
                onClick={() => setStage('confirm')}
              >
                Review order
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ════ STAGE 3 — Confirm ════ */}
        {stage === 'confirm' && (
          <div className="checkout-modal__body">
            <div className="checkout-modal__summary">
              <p className="checkout-modal__summary-label">Order summary</p>
              {selectedItems.map(item => (
                <div key={item.id} className="checkout-modal__summary-item">
                  <span className="checkout-modal__summary-title">
                    {item.title}
                    <span className="checkout-modal__summary-qty"> ×{item.quantity}</span>
                  </span>
                  <span>₦{item.subtotal.toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="checkout-modal__totals">
              <div className="checkout-modal__total-row">
                <span>Subtotal</span>
                <span>₦{selectedSubtotal.toLocaleString()}</span>
              </div>
              <div className="checkout-modal__total-row">
                <span className="checkout-modal__delivery-label">
                  <Truck size={12} color="#8A7968" /> Delivery fee
                </span>
                <span>₦{deliveryFee.toLocaleString()}</span>
              </div>
              <div className="checkout-modal__total-row checkout-modal__total-row--grand">
                <span>Total</span>
                <span className="checkout-modal__grand-total">
                  ₦{grandTotal.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="checkout-modal__address-preview">
              <MapPin size={13} color="#8A7968" />
              <p>{resolvedAddress}</p>
            </div>

            {error && <p className="checkout-modal__error">{error}</p>}

            <div className="checkout-modal__footer">
              <button
                className="checkout-modal__confirm-btn"
                disabled={submitting}
                onClick={handleConfirm}
              >
                {submitting
                  ? <><Loader size={15} className="checkout-modal__spin" /> Placing order...</>
                  : <>Place order · ₦{grandTotal.toLocaleString()}</>
                }
              </button>
              <p className="checkout-modal__terms">
                By placing this order you agree to Readdeck's delivery terms.
              </p>
            </div>
          </div>
        )}

        {/* ════ STAGE 4 — Success ════ */}
        {stage === 'success' && (
          <motion.div
            className="checkout-modal__success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <motion.div
              className="checkout-modal__success-icon"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.1 }}
            >
              <CheckCircle size={48} color="#22C55E" />
            </motion.div>

            <h2 className="checkout-modal__success-title">Order placed!</h2>
            <p className="checkout-modal__success-sub">
              {group.bookstore_name} has received your order and will begin preparing it shortly.
            </p>

            {orderResult && (
              <div className="checkout-modal__success-meta">
                <div className="checkout-modal__success-meta-item">
                  <Package size={14} color="#8A7968" />
                  <span>Order #{orderResult.id.slice(0, 8).toUpperCase()}</span>
                </div>
                <div className="checkout-modal__success-meta-item">
                  <Truck size={14} color="#8A7968" />
                  <span>Estimated delivery: 25–40 min</span>
                </div>
              </div>
            )}

            <div className="checkout-modal__success-actions">
              <button className="checkout-modal__track-btn" onClick={handleTrackOrder}>
                <Package size={15} /> Track order
              </button>
              <button className="checkout-modal__continue-btn" onClick={handleContinueShopping}>
                <ShoppingBag size={15} /> Continue shopping
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </>
  );
};

export default CheckoutModal;