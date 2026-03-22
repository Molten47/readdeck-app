import { useEffect, useState } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export interface Bookstore {
  id:                    string;
  name:                  string;
  address:               string;
  rating:                number;
  total_reviews:         number;
  delivery_time_minutes: number;
  delivery_fee:          number;
  minimum_order:         number;
  is_open:               boolean;
  image_emoji:           string;
  city:                  string;
  district:              string;
  state:                 string;
}

export function useBookstores() {
  const [bookstores, setBookstores] = useState<Bookstore[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState<string | null>(null);
  const [search,     setSearch]     = useState('');

  useEffect(() => {
    axios
      .get(`${API}/bookstores`, { withCredentials: true })
      .then(r => setBookstores(r.data.bookstores ?? []))
      .catch(() => setError('Failed to load bookstores'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = bookstores.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.city.toLowerCase().includes(search.toLowerCase())
  );

  return { bookstores: filtered, loading, error, search, setSearch };
}