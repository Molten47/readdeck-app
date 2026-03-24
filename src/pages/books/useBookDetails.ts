import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';

export interface BookDetail {
  id:             string;
  title:          string;
  author:         string;
  price:          number;
  description:    string | null;
  cover_url:      string | null;
  cover_emoji:    string;
  cover_color:    string;
  in_stock:       boolean;
  rating:         number;
  total_reviews:  number;
  category_name:  string;
  category_emoji: string;
  bookstore_name: string;
  bookstore_id:   string;
  city:           string;
}

export interface BookstoreAvailability {
  bookstore_id:       string;
  bookstore_name:     string;
  address:            string;
  city:               string;
  is_open:            boolean;
  delivery_time_mins: number;
  delivery_fee:       number;
  price:              number;
  in_stock:           boolean;
  rating:             number;
}

export function useBookDetail() {
  const { id }           = useParams<{ id: string }>();
  const [searchParams]   = useSearchParams();
  const preselectedStore = searchParams.get('store');

  const [book,         setBook]         = useState<BookDetail | null>(null);
  const [availability, setAvailability] = useState<BookstoreAvailability[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState<string | null>(null);
  const [selected,     setSelected]     = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [bookRes, availRes] = await Promise.all([
          axiosInstance.get(`/books/${id}`),
          axiosInstance.get(`/books/${id}/availability`),
        ]);
        setBook(bookRes.data.book);
        const stores: BookstoreAvailability[] = availRes.data.availability ?? [];
        setAvailability(stores);

        if (preselectedStore && stores.some(s => s.bookstore_id === preselectedStore)) {
          setSelected(preselectedStore);
        } else {
          const firstOpen = stores.find(s => s.is_open && s.in_stock);
          if (firstOpen) setSelected(firstOpen.bookstore_id);
        }
      } catch {
        setError('Failed to load book');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [id, preselectedStore]);

  const selectedStore = availability.find(s => s.bookstore_id === selected) ?? null;

  return {
    book,
    availability,
    loading,
    error,
    selected,
    setSelected,
    selectedStore,
  };
}