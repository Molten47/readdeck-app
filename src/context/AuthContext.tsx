import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { logout as logoutApi } from '../auth/auth';
import { silentAxios } from '../api/axiosInstance';
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
  else localStorage.removeItem(CACHE_KEY);
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
    // Use silentAxios — a 401 here must NOT trigger the interceptor logout
    // On mobile, cookies may not persist, so getMe() failing is expected
    // We only clear the user if we get a definitive non-401 failure
    silentAxios.get<MeResponse>('/auth/me')
      .then(res => setUser(res.data))
      .catch(err => {
        const status = err?.response?.status;
        if (status === 401 || status === undefined) {
          // Cookie missing or network issue — keep cached user, don't log out
          return;
        }
        // Any other error (403, 500 etc) — session is genuinely broken
        setUser(null);
      });
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