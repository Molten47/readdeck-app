import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, BookOpen } from 'lucide-react';
import type { Cart } from '../../../../context/CartContext';

interface Props {
  open:        boolean;
  setOpen:     (o: boolean | ((prev: boolean) => boolean)) => void;
  cartRef:     React.RefObject<HTMLDivElement | null>;
  cart:        Cart | null;
  cartLoading: boolean;
  navigate:    (path: string) => void;
}

const CartDropdown: React.FC<Props> = ({
  open, setOpen, cartRef, cart, cartLoading, navigate,
}) => {
  const previewItems = cart?.items.slice(0, 3) ?? [];
  const hasMore      = (cart?.item_count ?? 0) > 3;

  return (
    <div className="navbar__cart-wrap" ref={cartRef}>
      <button
        className={`navbar__cart-btn ${open ? 'navbar__cart-btn--open' : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-label="Cart"
      >
        <ShoppingCart size={16} />
        {(cart?.item_count ?? 0) > 0 && (
          <span className="navbar__cart-badge">{cart!.item_count}</span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="navbar__cart-dropdown"
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
          >
            {/* Header */}
            <div className="navbar__cart-header">
              <p className="navbar__cart-title">My Cart</p>
              {(cart?.item_count ?? 0) > 0 && (
                <span className="navbar__cart-count">
                  {cart!.item_count} item{cart!.item_count !== 1 ? 's' : ''}
                </span>
              )}
            </div>

            {/* Loading */}
            {cartLoading ? (
              <div className="navbar__cart-loading">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="navbar__cart-skel" />
                ))}
              </div>

            /* Empty */
            ) : previewItems.length === 0 ? (
              <div className="navbar__cart-empty">
                <ShoppingCart size={28} color="#2A2118" />
                <p>Your cart is empty</p>
                <button
                  className="navbar__cart-browse"
                  onClick={() => { navigate('/books'); setOpen(false); }}
                >
                  Browse books
                </button>
              </div>

            /* Items */
            ) : (
              <>
                <div className="navbar__cart-items">
                  {previewItems.map(item => (
                    <div key={item.id} className="navbar__cart-item">
                      <div className="navbar__cart-item-cover">
                        <BookOpen size={14} color="#E8622A" />
                      </div>
                      <div className="navbar__cart-item-info">
                        <p className="navbar__cart-item-title">{item.title}</p>
                        <p className="navbar__cart-item-meta">
                          x{item.quantity} · ₦{item.subtotal.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {hasMore && (
                  <p className="navbar__cart-more">
                    +{cart!.item_count - 3} more item{cart!.item_count - 3 !== 1 ? 's' : ''}
                  </p>
                )}

                <div className="navbar__cart-footer">
                  <div className="navbar__cart-total">
                    <span>Total</span>
                    <span className="navbar__cart-total-price">
                      ₦{cart!.total.toLocaleString()}
                    </span>
                  </div>
                  <button
                    className="navbar__cart-checkout"
                    onClick={() => { navigate('/cart'); setOpen(false); }}
                  >
                    View cart →
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CartDropdown;