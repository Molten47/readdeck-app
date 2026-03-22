import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export interface OrderSummary {
  id:           string;
  bookstore_id: string;
  status:       string;
  total_amount: number;
  item_count:   number;
  placed_at:    string;
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

const PAGE_LIMIT = 10;

export function useOrders() {
  const [orders,      setOrders]      = useState<OrderSummary[]>([]);
  const [total,       setTotal]       = useState(0);
  const [loading,     setLoading]     = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error,       setError]       = useState<string | null>(null);
  const [filter,      setFilter]      = useState<string | null>(null);
  const [cursor,      setCursor]      = useState<string | null>(null);
  const [hasMore,     setHasMore]     = useState(false);

  // Reset and fetch first page whenever filter changes
  useEffect(() => {
    setOrders([]);
    setCursor(null);
    setHasMore(false);
    setLoading(true);

    const params = new URLSearchParams();
    params.set('limit', String(PAGE_LIMIT));
    if (filter) params.set('status', filter);

    axios
      .get(`${API}/orders?${params}`, { withCredentials: true })
      .then(r => {
        setOrders(r.data.orders ?? []);
        setTotal(r.data.total ?? 0);
        setHasMore(r.data.has_more ?? false);
        setCursor(r.data.next_cursor ?? null);
        setError(null);
      })
      .catch(() => setError('Failed to load orders'))
      .finally(() => setLoading(false));
  }, [filter]);

  // Load next page
  const loadMore = useCallback(async () => {
    if (!hasMore || !cursor || loadingMore) return;
    setLoadingMore(true);

    try {
      const params = new URLSearchParams();
      params.set('limit', String(PAGE_LIMIT));
      params.set('cursor', cursor);
      if (filter) params.set('status', filter);

      const r = await axios.get(`${API}/orders?${params}`, { withCredentials: true });
      setOrders(prev => [...prev, ...(r.data.orders ?? [])]);
      setHasMore(r.data.has_more ?? false);
      setCursor(r.data.next_cursor ?? null);
    } catch {
      setError('Failed to load more orders');
    } finally {
      setLoadingMore(false);
    }
  }, [hasMore, cursor, filter, loadingMore]);

  return {
    orders, total, loading, loadingMore, error,
    filter, setFilter,
    hasMore, loadMore,
  };
}