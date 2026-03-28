import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { logout as logoutApi } from '../auth/auth';
import { silentAxios }         from '../api/axiosInstance';
import { getToken, setToken, clearToken } from '../api/interceptor';
import type { MeResponse } from '../types/auth';

interface AuthContextType {
  user:     MeResponse | null;
  loading:  boolean;
  isVendor: boolean;
  isAdmin:  boolean;
  setUser:  (user: MeResponse | null) => void;
  logout:   () => Promise<void>;
}

const CACHE_KEY = 'readdeck_user';

function readCache(): MeResponse | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as MeResponse) : null;
  } catch {
    return null;
  }
}

function writeCache(user: MeResponse | null) {
  if (user) localStorage.setItem(CACHE_KEY, JSON.stringify(user));
  else       localStorage.removeItem(CACHE_KEY);
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const cached = readCache();

  const [user,    setUserState] = useState<MeResponse | null>(cached);
  const [loading, setLoading]   = useState(false);

  const setUser = (u: MeResponse | null) => {
    writeCache(u);
    setUserState(u);
  };

  useEffect(() => {
    const token = getToken();
    if (!token && !cached) return; // nothing to revalidate

    // Use silentAxios with manual Bearer header — bypasses interceptor logout
    silentAxios.get<MeResponse>('/auth/me', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(res => setUser(res.data))
      .catch(err => {
        const status = err?.response?.status;
        if (status === 401 || status === undefined) {
          // Cookie/token missing or network blip — keep cache, stay logged in
          return;
        }
        // Genuine failure — clear everything
        clearToken();
        setUser(null);
      });
  }, []);

  const logout = async () => {
    await logoutApi();
    clearToken();
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