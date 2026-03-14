import { useRef, useEffect } from 'react';
import { useBookstoreSearch } from '../../../hooks/useBookstoreSearch';
import type { Bookstore, Suggestion } from '../../../hooks/useBookstoreSearch';

export type { Bookstore, Suggestion };

export const BOOKSTORE_IMAGES = [
  'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=400&q=80',
  'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400&q=80',
  'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80',
  'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&q=80',
  'https://images.unsplash.com/photo-1568667256549-094345857637?w=400&q=80',
];

export function countInArea(
  s: { type: string; city: string; district?: string },
  bookstores: { city: string; district: string }[]
): number {
  return bookstores.filter((b) => {
    if (s.type === 'city') return b.city.toLowerCase() === s.city.toLowerCase();
    return (
      b.city.toLowerCase() === s.city.toLowerCase() &&
      b.district.toLowerCase() === s.district?.toLowerCase()
    );
  }).length;
}

export const useBookstoreSearchUI = () => {
  const search = useBookstoreSearch();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        search.setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [search.setShowSuggestions]);

  return { ...search, containerRef };
};