import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export interface Book {
  id:             string;
  title:          string;
  author:         string;
  price:          number;
  description:    string | null;
  cover_url:      string | null;
  cover_emoji:    string | null;
  cover_color:    string | null;
  in_stock:       boolean;
  rating:         number;
  total_reviews:  number;
  bookstore_id:   string;
  category_name:  string;
  category_slug:  string;
  category_emoji: string;
  bookstore_name: string;
  city:           string;
}

export interface Category {
  id:          string;
  name:        string;
  slug:        string;
  emoji:       string;
  description: string | null;
}

const PAGE_LIMIT = 16;

export function useBooks() {
  const [books,          setBooks]          = useState<Book[]>([]);
  const [categories,     setCategories]     = useState<Category[]>([]);
  const [loading,        setLoading]        = useState(true);
  const [loadingMore,    setLoadingMore]    = useState(false);
  const [error,          setError]          = useState<string | null>(null);
  const [search,         setSearch]         = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [cursor,         setCursor]         = useState<number | null>(null);
  const [hasMore,        setHasMore]        = useState(false);

  // Fetch categories once on mount
  useEffect(() => {
    axios
      .get(`${API}/categories`, { withCredentials: true })
      .then(r => setCategories(r.data.categories ?? []))
      .catch(() => {});
  }, []);

  // Fetch first page whenever category changes
  useEffect(() => {
    setBooks([]);
    setCursor(null);
    setHasMore(false);
    setLoading(true);

    const params = new URLSearchParams();
    params.set('limit', String(PAGE_LIMIT));
    if (activeCategory) params.set('category', activeCategory);

    axios
      .get(`${API}/books?${params}`, { withCredentials: true })
      .then(r => {
        setBooks(r.data.books ?? []);
        setHasMore(r.data.has_more ?? false);
        setCursor(r.data.next_cursor ?? null);
        setError(null);
      })
      .catch(() => setError('Failed to load books'))
      .finally(() => setLoading(false));
  }, [activeCategory]);

  // Load next page
  const loadMore = useCallback(async () => {
    if (!hasMore || cursor === null || loadingMore) return;
    setLoadingMore(true);

    try {
      const params = new URLSearchParams();
      params.set('limit', String(PAGE_LIMIT));
      params.set('cursor', String(cursor));
      if (activeCategory) params.set('category', activeCategory);

      const r = await axios.get(`${API}/books?${params}`, { withCredentials: true });
      setBooks(prev => [...prev, ...(r.data.books ?? [])]);
      setHasMore(r.data.has_more ?? false);
      setCursor(r.data.next_cursor ?? null);
    } catch {
      setError('Failed to load more books');
    } finally {
      setLoadingMore(false);
    }
  }, [hasMore, cursor, activeCategory, loadingMore]);

  // Client-side search filter on top of paginated data
  const filtered = search.trim()
    ? books.filter(b =>
        b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.author.toLowerCase().includes(search.toLowerCase())
      )
    : books;

  return {
    books: filtered,
    categories,
    loading, loadingMore, error,
    search, setSearch,
    activeCategory, setActiveCategory,
    hasMore, loadMore,
  };
}