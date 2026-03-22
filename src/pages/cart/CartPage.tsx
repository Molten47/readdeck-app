import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, ShoppingBag, Store, ChevronRight } from 'lucide-react';
import { useCart } from './useCart';
import { useCartContext, type CartGroup } from '../../context/CartContext';
import CartItemRow from './components/CartItemRow';
import SkeletonItem from './components/SkeletonItem';
import CheckoutModal from '../checkout/CheckoutModal';
import './cart.css';

const CartPage: React.FC = () => {
  const {
    cart, loading, error,
    isDark, navigate,
    clearConfirm,
    handleQuantityChange,
    handleRemove,
    handleClear,
    isEmpty,
  } = useCart();

  const { cartGroups } = useCartContext();

  const [activeGroup, setActiveGroup] = useState<CartGroup | null>(null);

  const pageClass = `cart-page${isDark ? '' : ' cart-page--light'}`;

  return (
    <div className={pageClass}>
      <div className="cart-page__inner">

        {/* ── Header ── */}
        <div className="cart-page__header">
          <p className="cart-page__eyebrow">
            <ShoppingBag size={13} />
            My Cart
          </p>
          <h1 className="cart-page__title">
            {loading
              ? 'Loading your cart...'
              : isEmpty
                ? 'Your cart is empty'
                : `${cart!.item_count} item${cart!.item_count !== 1 ? 's' : ''} in your cart`
            }
          </h1>
        </div>

        {error && (
          <p style={{ color: '#E8622A', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
            {error}
          </p>
        )}

        {/* ── Loading ── */}
        {loading && (
          <div className="cart-page__layout">
            <div className="cart-page__items">
              {[...Array(3)].map((_, i) => <SkeletonItem key={i} />)}
            </div>
          </div>
        )}

        {/* ── Empty ── */}
        {!loading && isEmpty && (
          <motion.div
            className="cart-page__empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <ShoppingCart size={48} color="#2A2118" />
            <p className="cart-page__empty-title">Nothing here yet</p>
            <p className="cart-page__empty-sub">
              Browse our bookstores and add your first book
            </p>
            <button
              className="cart-page__empty-btn"
              onClick={() => navigate('/books')}
            >
              Browse books →
            </button>
          </motion.div>
        )}

        {/* ── Cart content ── */}
        {!loading && !isEmpty && cart && (
          <div className="cart-page__layout">
            <div>

              {/* Clear cart header */}
              <div className="cart-page__items-header">
                <span className="cart-page__items-count">
                  {cart.item_count} item{cart.item_count !== 1 ? 's' : ''}
                  {cartGroups.length > 1 && ` across ${cartGroups.length} stores`}
                </span>
                <button
                  className={`cart-page__clear ${clearConfirm ? 'cart-page__clear--confirm' : ''}`}
                  onClick={handleClear}
                >
                  {clearConfirm ? 'Tap again to confirm' : 'Clear cart'}
                </button>
              </div>

              {/* ── Groups by bookstore ── */}
              {cartGroups.map(group => (
                <motion.div
                  key={group.bookstore_id}
                  className="cart-page__group"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                >
                  {/* Group header */}
                  <div className="cart-page__group-header">
                    <div className="cart-page__group-store">
                      <Store size={14} color="#E8622A" />
                      <span>{group.bookstore_name}</span>
                      <span className="cart-page__group-count">
                        {group.items.length} item{group.items.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <span className="cart-page__group-subtotal">
                      ₦{group.subtotal.toLocaleString()}
                    </span>
                  </div>

                  {/* Items */}
                  <div className="cart-page__items">
                    <AnimatePresence mode="popLayout">
                      {group.items.map(item => (
                        <CartItemRow
                          key={item.id}
                          item={item}
                          onQuantityChange={handleQuantityChange}
                          onRemove={handleRemove}
                        />
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* Order from this store CTA */}
                  <button
                    className="cart-page__group-order-btn"
                    onClick={() => setActiveGroup(group)}
                  >
                    Order from {group.bookstore_name}
                    <ChevronRight size={15} />
                  </button>
                </motion.div>
              ))}

            </div>

            {/* Right sidebar — total across all groups */}
            <div className="cart-page__sidebar">
              <div className="cart-page__sidebar-card">
                <p className="cart-page__sidebar-title">Cart total</p>
                <div className="cart-page__sidebar-row">
                  <span>Items ({cart.item_count})</span>
                  <span>₦{cart.total.toLocaleString()}</span>
                </div>
                <p className="cart-page__sidebar-note">
                  Delivery fees calculated per store at checkout
                </p>
                {cartGroups.length > 1 && (
                  <p className="cart-page__sidebar-hint">
                    You have items from {cartGroups.length} stores. Order from each store separately.
                  </p>
                )}
              </div>
            </div>

          </div>
        )}
      </div>

      {/* ── Checkout Modal ── */}
      <AnimatePresence>
        {activeGroup && (
          <CheckoutModal
            group={activeGroup}
            onClose={() => setActiveGroup(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CartPage;