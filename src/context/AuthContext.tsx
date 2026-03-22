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

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user,    setUser]    = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMe()
      .then(setUser)
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