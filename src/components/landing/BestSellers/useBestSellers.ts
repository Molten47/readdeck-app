import { useEffect, useState } from 'react';
import image1 from '../../../assets/img_8083.jpg';
import image2 from '../../../assets/born_a_crime.jpg';
import image3 from '../../../assets/things-fall-apart.jpg';
import image4 from '../../../assets/half-of-a-yellow-sun.webp';
import image5 from '../../../assets/big_bum_bum.jpg';
import image6 from '../../../assets/ponmo_is_a_bird_cover_front.png';
import image7 from '../../../assets/atomic-habits.jpg';

export interface Book {
  id: string;
  title: string;
  author: string;
  price: string | number | { toString(): string };
  rating: string | number;
  category_name: string;
}

export const IMAGE_MAP: Record<string, string> = {
  'Only Big Bumbum Matter Tomorrow': image5,
  'Born a Crime':                    image2,
  'Things Fall Apart':               image3,
  'Atomic Habits':                   image7,
  'Half of  a yellow sun':           image4,
  'Ponmo is a bird':                 image6,
  'Dream Count':                     image1
  
  

};

export const BG_MAP: Record<string, string> = {
  'Fiction':     '#1A2A1A',
  'Non-Fiction': '#1E2A3A',
  'Self Help':   '#2A1E1A',
  'Textbooks':   '#1A1A2A',
  'Children':    '#2A2A1A',
  'Business':    '#1A2A2A',
  'Science':     '#1E1A2A',
  'History':     '#2A1A1E',
};

export const formatPrice = (price: Book['price']): string => {
  const num = Number(price.toString());
  return `₦${num.toLocaleString()}`;
};

export const formatRating = (rating: Book['rating']): string => {
  return Number(rating).toFixed(1);
};

export const useBestSellers = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
        const res = await fetch(`${API}/books`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) throw new Error(`Server responded with ${res.status}`);

        const json = await res.json();
        const data: Book[] = json.books;

        if (!Array.isArray(data) || data.length === 0) {
          setBooks([]);
          return;
        }

        const FEATURED = [
          'Only Big Bumbum Matter Tomorrow',
          'Ponmo Is a Bird',
          'Dream Count',
          'Atomic Habits',
        ];

        // Only include featured titles that actually exist in the response
        const featured = FEATURED
          .map(title => data.find(b => b?.title === title))
          .filter((b): b is Book => b !== undefined);

        // Pad with top-rated books if featured count is less than 4
        const featuredTitles = new Set(featured.map(b => b.title));
        const remaining = data
          .filter(b => b?.title && !featuredTitles.has(b.title))
          .sort((a, b) => Number(b.rating) - Number(a.rating));

        const result = [...featured, ...remaining]
          .filter((b): b is Book => b !== undefined && !!b.title)
          .slice(0, 4);

        setBooks(result);
      } catch (err) {
        console.error('Books fetch error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return { books, loading, error };
};