import { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export type SetupStep = 1 | 2 | 3 | 4;

export interface BookstoreForm {
  name:                  string;
  address:               string;
  city:                  string;
  district:              string;
  description:           string;
  genres:                string[];
  image_emoji:           string;
  banner_color:          string;
  delivery_fee:          string;
  minimum_order:         string;
  delivery_time_minutes: string;
  opening_hours:         string;
  instagram:             string;
  website:               string;
}

export const GENRE_OPTIONS = [
  'Fiction', 'Non-Fiction', 'Self Help', 'Business',
  'Textbooks', 'Children', 'Science', 'History',
  'Romance', 'Thriller', 'Biography', 'Poetry',
  'Religion', 'Law', 'Medicine', 'Technology',
];

export const EMOJI_OPTIONS = [
  '📚', '📖', '📗', '📘', '📙', '📒', '📕',
  '🏛️', '🎭', '🌟', '🎓', '👑', '🏙️', '🌍',
];

export const COLOR_OPTIONS = [
  '#1A1410', '#0F1A2E', '#1A2E0F', '#2E0F1A',
  '#0F2E2A', '#2E2A0F', '#1A0F2E', '#2E1A0F',
  '#0A1628', '#28160A', '#0A2816', '#28120A',
];

const EMPTY: BookstoreForm = {
  name: '', address: '', city: '', district: '',
  description: '', genres: [], image_emoji: '📚', banner_color: '#1A1410',
  delivery_fee: '500', minimum_order: '1000', delivery_time_minutes: '30',
  opening_hours: 'Mon–Sat: 9am–7pm',
  instagram: '', website: '',
};

export function useVendorSetup() {
  const navigate   = useNavigate();
  const submitLock = useRef(false);

  const [step,       setStep]       = useState<SetupStep>(1);
  const [form,       setForm]       = useState<BookstoreForm>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState<string | null>(null);
  const [success,    setSuccess]    = useState(false);

  const update = (field: keyof BookstoreForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }));

  const toggleGenre = (genre: string) =>
    setForm(prev => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : prev.genres.length < 6
          ? [...prev.genres, genre]
          : prev.genres,
    }));

  const setEmoji = (emoji: string) =>
    setForm(prev => ({ ...prev, image_emoji: emoji }));

  const setColor = (color: string) =>
    setForm(prev => ({ ...prev, banner_color: color }));

  const canNext = (): boolean => {
    if (step === 1) return !!(form.name.trim() && form.address.trim() && form.city.trim() && form.district.trim());
    if (step === 2) return !!(form.description.trim() && form.genres.length > 0);
    if (step === 3) return !!(form.delivery_fee && form.minimum_order && form.delivery_time_minutes && form.opening_hours.trim());
    return true;
  };

  const next = () => {
    if (!canNext()) { setError('Please fill in all required fields.'); return; }
    setError(null);
    setStep(s => Math.min(s + 1, 4) as SetupStep);
  };

  const back = () => {
    setError(null);
    setStep(s => Math.max(s - 1, 1) as SetupStep);
  };

  const submit = async () => {
    if (submitLock.current) return;
    submitLock.current = true;
    setSubmitting(true);
    setError(null);

    try {
      await axios.post(
        `${API}/vendor/bookstore`,
        {
          name:                  form.name.trim(),
          address:               form.address.trim(),
          city:                  form.city.trim(),
          district:              form.district.trim(),
          description:           form.description.trim(),
          genres:                form.genres,
          image_emoji:           form.image_emoji,
          banner_color:          form.banner_color,
          delivery_fee:          parseFloat(form.delivery_fee),
          minimum_order:         parseFloat(form.minimum_order),
          delivery_time_minutes: parseInt(form.delivery_time_minutes, 10),
          opening_hours:         form.opening_hours.trim(),
          instagram:             form.instagram.trim() || null,
          website:               form.website.trim()   || null,
        },
        { withCredentials: true },
      );

      // Show success state briefly so the user sees feedback
      // then navigate — gives the vendor API time to see the new bookstore
      setSuccess(true);
      setSubmitting(false);

      setTimeout(() => {
        // Use window.location for a hard redirect — this forces VendorDashboard
        // to remount and re-fetch stats fresh, so has_bookstore will be true
        window.location.href = '/vendor';
      }, 1200);

    } catch (err: any) {
      const msg = err?.response?.data?.error
        ?? err?.response?.data?.message
        ?? 'Failed to create bookstore. Try again.';
      setError(msg);
      submitLock.current = false; // unlock so they can retry
      setSubmitting(false);
    }
  };

  return {
    step, next, back,
    form, update, toggleGenre, setEmoji, setColor,
    canNext, submitting, error, success,
    submit,
  };
}