import { useEffect, useState } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export interface BookEvent {
  id:           string;
  title:        string;
  description:  string | null;
  location:     string;
  bookstore_id: string | null;
  starts_at:    string;
  ends_at:      string | null;
  cover_url:    string | null;
  is_free:      boolean;
  price:        number | null;
}

export function useEvents() {
  const [events,    setEvents]    = useState<BookEvent[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState<string | null>(null);
  const [freeOnly,  setFreeOnly]  = useState(false);
  const [upcoming,  setUpcoming]  = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API}/events`, {
        params: { upcoming, free: freeOnly || undefined },
        withCredentials: true,
      })
      .then(r => setEvents(r.data.events))
      .catch(() => setError('Failed to load events'))
      .finally(() => setLoading(false));
  }, [freeOnly, upcoming]);

  return { events, loading, error, freeOnly, setFreeOnly, upcoming, setUpcoming };
}