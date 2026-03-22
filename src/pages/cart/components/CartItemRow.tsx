import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Trash2, Minus, Plus } from 'lucide-react';
import type { CartItem } from '../../../context/CartContext';

interface Props {
  item:             CartItem;
  onQuantityChange: (id: string, qty: number) => void;
  onRemove:         (id: string) => void;
}

const CartItemRow: React.FC<Props> = ({ item, onQuantityChange, onRemove }) => (
  <motion.div
    className="cart-item"
    layout
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, x: -20, scale: 0.97 }}
    transition={{ duration: 0.25 }}
  >
    {/* Cover */}
    <div className="cart-item__cover">
      <BookOpen size={20} color="#E8622A" />
    </div>

    {/* Info */}
    <div className="cart-item__info">
      <p className="cart-item__title">{item.title}</p>
      <p className="cart-item__author">{item.author}</p>
      <p className="cart-item__price-snap">
        ₦{item.price_snapshot.toLocaleString()} each
      </p>
    </div>

    {/* Controls */}
    <div className="cart-item__controls">

      {/* Quantity */}
      <div className="cart-item__qty">
        <button
          className="cart-item__qty-btn"
          onClick={() => onQuantityChange(item.id, item.quantity - 1)}
          disabled={item.quantity <= 1}
        >
          <Minus size={11} />
        </button>
        <span className="cart-item__qty-value">{item.quantity}</span>
        <button
          className="cart-item__qty-btn"
          onClick={() => onQuantityChange(item.id, item.quantity + 1)}
        >
          <Plus size={11} />
        </button>
      </div>

      {/* Subtotal */}
      <span className="cart-item__subtotal">
        ₦{item.subtotal.toLocaleString()}
      </span>

      {/* Remove */}
      <button
        className="cart-item__remove"
        onClick={() => onRemove(item.id)}
        aria-label="Remove item"
      >
        <Trash2 size={15} />
      </button>

    </div>
  </motion.div>
);

export default CartItemRow;