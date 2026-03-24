import { useState, useEffect, useRef, useCallback } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { useAuth } from '../../context/AuthContext';

export interface VendorApplication {
  id:            string;
  store_name:    string;
  store_address: string;
  city:          string;
  status:        string;
  submitted_at:  string;
  reviewed_at:   string | null;
}

export interface VendorForm {
  store_name:    string;
  store_address: string;
  city:          string;
  phone:         string;
  description:   string;
  instagram:     string;
  website:       string;
}

export const STATUS_COPY: Record<string, { label: string; description: string }> = {
  pending: {
    label:       'Application submitted',
    description: 'We\'re reviewing your application. This usually takes 2–3 business days.',
  },
  reviewing: {
    label:       'Under review',
    description: 'Our team is looking at your application. Hang tight!',
  },
  approved: {
    label:       'Approved!',
    description: 'Welcome to Readdeck. Your vendor dashboard is ready.',
  },
  rejected: {
    label:       'Not approved',
    description: 'Your application wasn\'t approved this time. You can apply again in 30 days.',
  },
};

const EMPTY_FORM: VendorForm = {
  store_name:    '',
  store_address: '',
  city:          '',
  phone:         '',
  description:   '',
  instagram:     '',
  website:       '',
};

export function useBecomeVendor() {
  const { setUser } = useAuth();

  const [form,            setForm]           = useState<VendorForm>(EMPTY_FORM);
  const [existing,        setExisting]       = useState<VendorApplication | null>(null);
  const [loading,         setLoading]        = useState(true);
  const [submitting,      setSubmitting]     = useState(false);
  const [submitted,       setSubmitted]      = useState(false);
  const [error,           setError]          = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  const pollRef          = useRef<ReturnType<typeof setInterval> | null>(null);
  const consecutiveFails = useRef(0);

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  // ── On mount: check for existing application ──────────────────
  useEffect(() => {
    axiosInstance
      .get('/vendor/status')
      .then(r => setExisting(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));

    return () => stopPolling();
  }, [stopPolling]);

  // ── Handle approval — refresh token so new role is in cookie ──
  const handleApproval = useCallback(async () => {
    stopPolling();

    try {
      await axiosInstance.post('/auth/refresh');
      const meRes = await axiosInstance.get('/auth/me');
      setUser(meRes.data);
    } catch {
      // If refresh fails, user can log out and back in
      // Still show celebration — modal guides them forward
    }

    setShowCelebration(true);
  }, [stopPolling, setUser]);

  // ── Poll for approval ─────────────────────────────────────────
  const startPolling = useCallback(() => {
    if (pollRef.current) return;
    consecutiveFails.current = 0;

    pollRef.current = setInterval(async () => {
      if (consecutiveFails.current >= 3) {
        stopPolling();
        return;
      }

      try {
        const r   = await axiosInstance.get('/vendor/status');
        const app: VendorApplication = r.data;

        consecutiveFails.current = 0;
        setExisting(app);

        if (app.status === 'approved') {
          await handleApproval();
        }
      } catch (err: any) {
        if (err?.response?.status === 429) {
          consecutiveFails.current += 1;
        }
      }
    }, 10_000);
  }, [stopPolling, handleApproval]);

  // Auto-start polling if pending on mount
  useEffect(() => {
    if (existing?.status === 'pending' || existing?.status === 'reviewing') {
      startPolling();
    }
    if (existing?.status === 'approved') {
      handleApproval();
    }
  }, [existing, startPolling, handleApproval]);

  const update = (field: keyof VendorForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }));

  const submit = async () => {
    setError(null);
    if (!form.store_name.trim() || !form.store_address.trim() ||
        !form.city.trim()       || !form.phone.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    setSubmitting(true);
    try {
      const r = await axiosInstance.post('/vendor/apply', form);
      setExisting(r.data);
      setSubmitted(true);
      startPolling();
    } catch (err: any) {
      setError(err?.response?.data?.error ?? 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const dismissCelebration = useCallback(() => {
    setShowCelebration(false);
  }, []);

  return {
    form, update,
    existing,
    loading, submitting, submitted,
    error,
    submit,
    showCelebration, dismissCelebration,
  };
}