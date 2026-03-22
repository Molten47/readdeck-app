import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export interface BookstoreDetail {
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

export interface StoreBook {
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
  category_slug:  string;
  category_emoji: string;
  bookstore_id:   string;
  bookstore_name: string;
  city:           string;
}

export function useBookstoreDetail() {
  const { id } = useParams<{ id: string }>();

  const [store,   setStore]   = useState<BookstoreDetail | null>(null);
  const [books,   setBooks]   = useState<StoreBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);
  const [search,  setSearch]  = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [storeRes, booksRes] = await Promise.all([
          axios.get(`${API}/bookstores/${id}`,        { withCredentials: true }),
          axios.get(`${API}/bookstores/${id}/books`,  { withCredentials: true }),
        ]);
        setStore(storeRes.data.bookstore);
        setBooks(booksRes.data.books ?? []);
      } catch {
        setError('Failed to load bookstore');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [id]);

  // Derive unique categories from the books list
  const categories = Array.from(
    new Map(
      books.map(b => [b.category_slug, { slug: b.category_slug, name: b.category_name, emoji: b.category_emoji }])
    ).values()
  );

  const filtered = books.filter(b => {
    const matchesSearch   = b.title.toLowerCase().includes(search.toLowerCase()) ||
                            b.author.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !activeCategory || b.category_slug === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return {
    store,
    books: filtered,
    categories,
    loading,
    error,
    search,
    setSearch,
    activeCategory,
    setActiveCategory,
  };
}