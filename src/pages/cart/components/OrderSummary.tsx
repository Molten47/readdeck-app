import React from 'react';

interface Props {
  total:      number;
  itemCount:  number;
  onCheckout: () => void;
  onContinue: () => void;
}

const OrderSummary: React.FC<Props> = ({ total, itemCount, onCheckout, onContinue }) => {
  const grandTotal = total; // delivery free for now

  return (
    <div className="cart-summary">
      <p className="cart-summary__title">Order Summary</p>

      <div className="cart-summary__rows">
        <div className="cart-summary__row">
          <span>Subtotal ({itemCount} item{itemCount !== 1 ? 's' : ''})</span>
          <span className="cart-summary__row-price">
            ₦{total.toLocaleString()}
          </span>
        </div>
        <div className="cart-summary__row">
          <span>Delivery</span>
          <span style={{ color: '#E8622A', fontWeight: 600 }}>Free</span>
        </div>
        <div className="cart-summary__row cart-summary__row--total">
          <span>Total</span>
          <span className="cart-summary__total-price">
            ₦{grandTotal.toLocaleString()}
          </span>
        </div>
      </div>

      <button className="cart-summary__checkout" onClick={onCheckout}>
        Proceed to checkout →
      </button>
      <button className="cart-summary__continue" onClick={onContinue}>
        Continue shopping
      </button>
    </div>
  );
};

export default OrderSummary;