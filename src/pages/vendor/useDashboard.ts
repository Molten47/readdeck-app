import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { buildGreeting } from './dashNeed';
import type { Stats, VendorOrder, GreetingResult } from './dashNeed';

const VENDOR_API = import.meta.env.VITE_VENDOR_API_URL ?? 'http://localhost:3001';

export interface UseVendorDashboardReturn {
  stats:         Stats | null;
  pendingOrders: VendorOrder[];
  otherOrders:   VendorOrder[];
  loading:       boolean;
  error:         string | null;
  hasBookstore:  boolean;
  greeting:      GreetingResult;
  fetchData:     () => void;
  navigate:      ReturnType<typeof useNavigate>;
}

export const useVendorDashboard = (): UseVendorDashboardReturn => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const greeting = useMemo(() => buildGreeting(user?.username), [user?.username]);

  const [stats,        setStats]        = useState<Stats | null>(null);
  const [orders,       setOrders]       = useState<VendorOrder[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState<string | null>(null);
  const [hasBookstore, setHasBookstore] = useState(true);

  const fetchData = () => {
    setLoading(true);
    setError(null);

    Promise.all([
      axios.get(`${VENDOR_API}/vendor/stats`,           { withCredentials: true }),
      axios.get(`${VENDOR_API}/vendor/orders?limit=10`, { withCredentials: true }),
    ])
      .then(([statsRes, ordersRes]) => {
        const s: Stats = statsRes.data;
        setStats(s);

        const bookstoreExists =
          s.has_bookstore !== undefined
            ? s.has_bookstore
            : s.bookstore_id != null;
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
  };

  useEffect(() => { fetchData(); }, []);

  return {
    stats,
    pendingOrders: orders.filter(o => o.status === 'pending'),
    otherOrders:   orders.filter(o => o.status !== 'pending'),
    loading,
    error,
    hasBookstore,
    greeting,
    fetchData,
    navigate,
  };
};