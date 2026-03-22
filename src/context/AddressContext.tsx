import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

// ── Types ─────────────────────────────────────────────────────────

export interface SavedAddress {
  id:         string;
  label:      string;
  address:    string;
  city:       string;
  phone:      string;
  is_default: boolean;
  created_at: string;
}

export interface CreateAddressPayload {
  label:      string;
  address:    string;
  city:       string;
  phone:      string;
  is_default?: boolean;
}

export interface UpdateAddressPayload {
  label?:      string;
  address?:    string;
  city?:       string;
  phone?:      string;
  is_default?: boolean;
}

interface AddressContextType {
  addresses:        SavedAddress[];
  defaultAddress:   SavedAddress | null;
  loading:          boolean;
  error:            string | null;
  fetchAddresses:   () => Promise<void>;
  createAddress:    (payload: CreateAddressPayload) => Promise<SavedAddress>;
  updateAddress:    (id: string, payload: UpdateAddressPayload) => Promise<SavedAddress>;
  deleteAddress:    (id: string) => Promise<void>;
  setDefaultAddress:(id: string) => Promise<void>;
}

// ── Context ───────────────────────────────────────────────────────

const AddressContext = createContext<AddressContextType | null>(null);

export const AddressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const { user }                  = useAuth();

  const defaultAddress = addresses.find(a => a.is_default) ?? addresses[0] ?? null;

  const fetchAddresses = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API}/addresses`, { withCredentials: true });
      setAddresses(res.data.addresses ?? []);
      setError(null);
    } catch {
      setError('Failed to load addresses');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) fetchAddresses();
    else setAddresses([]);
  }, [user, fetchAddresses]);

  const createAddress = async (payload: CreateAddressPayload): Promise<SavedAddress> => {
    const res = await axios.post(`${API}/addresses`, payload, { withCredentials: true });
    await fetchAddresses();
    return res.data;
  };

  const updateAddress = async (id: string, payload: UpdateAddressPayload): Promise<SavedAddress> => {
    const res = await axios.patch(`${API}/addresses/${id}`, payload, { withCredentials: true });
    await fetchAddresses();
    return res.data;
  };

  const deleteAddress = async (id: string): Promise<void> => {
    await axios.delete(`${API}/addresses/${id}`, { withCredentials: true });
    setAddresses(prev => prev.filter(a => a.id !== id));
  };

  const setDefaultAddress = async (id: string): Promise<void> => {
    await axios.patch(`${API}/addresses/${id}/default`, {}, { withCredentials: true });
    setAddresses(prev => prev.map(a => ({ ...a, is_default: a.id === id })));
  };

  return (
    <AddressContext.Provider value={{
      addresses, defaultAddress, loading, error,
      fetchAddresses, createAddress, updateAddress,
      deleteAddress, setDefaultAddress,
    }}>
      {children}
    </AddressContext.Provider>
  );
};

export const useAddresses = () => {
  const ctx = useContext(AddressContext);
  if (!ctx) throw new Error('useAddresses must be used within AddressProvider');
  return ctx;
};