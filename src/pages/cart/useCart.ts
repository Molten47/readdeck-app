import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartContext } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';

export const useCart = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const {
    cart, loading, error,
    updateQuantity, removeItem, clearCart,
  } = useCartContext();

  const [clearConfirm, setClearConfirm] = useState(false);

  const handleQuantityChange = async (item_id: string, quantity: number) => {
    if (quantity < 1) return;
    await updateQuantity(item_id, quantity);
  };

  const handleRemove = async (item_id: string) => {
    await removeItem(item_id);
  };

  const handleClear = async () => {
    if (!clearConfirm) {
      setClearConfirm(true);
      setTimeout(() => setClearConfirm(false), 3000);
      return;
    }
    await clearCart();
    setClearConfirm(false);
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const isEmpty = !cart || cart.items.length === 0;

  return {
    cart, loading, error,
    isDark, navigate,
    clearConfirm,
    handleQuantityChange,
    handleRemove,
    handleClear,
    handleCheckout,
    isEmpty,
  };
};