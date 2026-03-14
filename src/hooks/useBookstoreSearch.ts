import { useState, useEffect, useMemo } from 'react';

export interface Bookstore {
  id: string;
  name: string;
  address: string;
  city: string;
  district: string;
  state: string;
  rating: number;
  total_reviews: number;
  delivery_time_minutes: number;
  delivery_fee: number;
  minimum_order: number;
  is_open: boolean;
  image_emoji: string;
}

export interface Suggestion {
  label: string;
  city: string;
  district?: string;
  type: 'city' | 'district';
}

export const useBookstoreSearch = () => {
  const [allBookstores, setAllBookstores] = useState<Bookstore[]>([]);
  const [query, setQuery] = useState('');
  const [activeSuggestion, setActiveSuggestion] = useState<Suggestion | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Fetch all bookstores once
  useEffect(() => {
    const fetchBookstores = async () => {
      try {
        const res = await fetch('http://localhost:3000/bookstores', {
          credentials: 'include',
        });
        const data = await res.json();
        setAllBookstores(data.bookstores);
      } catch (err) {
        console.error('Failed to fetch bookstores:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookstores();
  }, []);

  // Build unique suggestions from bookstore data
  const allSuggestions = useMemo<Suggestion[]>(() => {
    const cities = new Map<string, Suggestion>();
    const districts = new Map<string, Suggestion>();

    allBookstores.forEach((b) => {
      if (!cities.has(b.city)) {
        cities.set(b.city, { label: b.city, city: b.city, type: 'city' });
      }
      const key = `${b.district}-${b.city}`;
      if (!districts.has(key)) {
        districts.set(key, {
          label: `${b.district}, ${b.city}`,
          city: b.city,
          district: b.district,
          type: 'district',
        });
      }
    });

    return [...cities.values(), ...districts.values()];
  }, [allBookstores]);

  // Filter suggestions based on query
  const suggestions = useMemo(() => {
    if (!query.trim() || query.length < 2) return [];
    return allSuggestions.filter((s) =>
      s.label.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, allSuggestions]);

  // Filter bookstores based on active suggestion
  const filteredBookstores = useMemo(() => {
    if (!activeSuggestion) return allBookstores;
    return allBookstores.filter((b) => {
      if (activeSuggestion.type === 'city') {
        return b.city.toLowerCase() === activeSuggestion.city.toLowerCase();
      }
      return (
        b.city.toLowerCase() === activeSuggestion.city.toLowerCase() &&
        b.district.toLowerCase() === activeSuggestion.district?.toLowerCase()
      );
    });
  }, [allBookstores, activeSuggestion]);

  const handleSelect = (suggestion: Suggestion) => {
    setQuery(suggestion.label);
    setActiveSuggestion(suggestion);
    setShowSuggestions(false);
  };

  const handleClear = () => {
    setQuery('');
    setActiveSuggestion(null);
    setShowSuggestions(false);
  };

  return {
    query,
    setQuery,
    suggestions,
    showSuggestions,
    setShowSuggestions,
    filteredBookstores,
    loading,
    handleSelect,
    handleClear,
  };
};