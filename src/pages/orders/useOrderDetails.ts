import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export interface OrderItem {
  id:          string;
  book_id:     string;
  title:       string;
  author:      string;
  cover_emoji: string | null;
  cover_color: string | null;
  quantity:    number;
  unit_price:  number;
  subtotal:    number;
}

export interface OrderDetail {
  id:           string;
  bookstore_id: string;
  status:       string;
  total_amount: number;
  delivery_fee: number;
  address:      string;
  notes:        string | null;
  placed_at:    string;
  updated_at:   string;
  items:        OrderItem[];
}

export const STATUS_LABELS: Record<string, string> = {
  pending:    'Pending',
  confirmed:  'Confirmed',
  preparing:  'Preparing',
  in_transit: 'On the way',
  delivered:  'Delivered',
  cancelled:  'Cancelled',
};

export const STATUS_COLOR: Record<string, string> = {
  pending:    '#8A7968',
  confirmed:  '#3B82F6',
  preparing:  '#F59E0B',
  in_transit: '#8B5CF6',
  delivered:  '#22C55E',
  cancelled:  '#EF4444',
};

// Status step index for the progress tracker
export const STATUS_STEPS = ['pending', 'confirmed', 'preparing', 'in_transit', 'delivered'];

export const STATUS_STEP_LABELS: Record<string, string> = {
  pending:    'Order placed',
  confirmed:  'Confirmed',
  preparing:  'Being prepared',
  in_transit: 'On the way',
  delivered:  'Delivered',
};

export function useOrderDetail() {
  const { id }    = useParams<{ id: string }>();
  const navigate  = useNavigate();

  const [order,       setOrder]       = useState<OrderDetail | null>(null);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState<string | null>(null);
  const [cancelling,  setCancelling]  = useState(false);
  const [cancelDone,  setCancelDone]  = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    axios
      .get(`${API}/orders/${id}`, { withCredentials: true })
      .then(r => setOrder(r.data))
      .catch(() => setError('Order not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleCancel = async () => {
    if (!id || !order) return;
    setCancelling(true);
    try {
      await axios.delete(`${API}/orders/${id}`, { withCredentials: true });
      setOrder(prev => prev ? { ...prev, status: 'cancelled' } : prev);
      setCancelDone(true);
    } catch {
      setError('Could not cancel order. It may already be confirmed.');
    } finally {
      setCancelling(false);
    }
  };

  const currentStepIndex = order
    ? STATUS_STEPS.indexOf(order.status)
    : -1;

  const isCancelled   = order?.status === 'cancelled';
  const canCancel     = order?.status === 'pending' && !cancelDone;
  const subtotal      = order ? order.total_amount - order.delivery_fee : 0;

  return {
    order, loading, error,
    cancelling, cancelDone,
    handleCancel,
    currentStepIndex,
    isCancelled, canCancel,
    subtotal,
    navigate,
  };
}