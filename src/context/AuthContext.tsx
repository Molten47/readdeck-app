import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { getMe, logout as logoutApi } from '../auth/auth';
import type { MeResponse } from '../types/auth';

interface AuthContextType {
  user:      MeResponse | null;
  loading:   boolean;
  isVendor:  boolean;
  isAdmin:   boolean;
  setUser:   (user: MeResponse | null) => void;
  logout:    () => Promise<void>;
}

const AUTH_CACHE_KEY = 'readdeck_user';

function readCache(): MeResponse | null {
  try {
    const raw = localStorage.getItem(AUTH_CACHE_KEY);
    return raw ? (JSON.parse(raw) as MeResponse) : null;
  } catch {
    return null;
  }
}

function writeCache(user: MeResponse | null) {
  if (user) localStorage.setItem(AUTH_CACHE_KEY, JSON.stringify(user));
  else localStorage.removeItem(AUTH_CACHE_KEY);
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const cached = readCache();

  // If we have a cached user, start with it — no spinner
  const [user,    setUserState] = useState<MeResponse | null>(cached);
  const [loading, setLoading]   = useState(!cached); // only show loader if no cache

  const setUser = (u: MeResponse | null) => {
    writeCache(u);
    setUserState(u);
  };

  useEffect(() => {
    // Always validate in background — but don't block UI if cache exists
    getMe()
      .then(fresh => setUser(fresh))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const logout = async () => {
    await logoutApi();
    setUser(null);
    window.location.href = '/login';
  };

  const isVendor = user?.role === 'vendor' || user?.role === 'admin';
  const isAdmin  = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, loading, isVendor, isAdmin, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};