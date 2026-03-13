import { useState } from 'react';
import { login as loginApi } from '../auth/auth';
import type { AuthResponse, LoginRequest } from '../types/auth';

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const login = async (data: LoginRequest): Promise<AuthResponse | null> => {
    try {
      setLoading(true);
      setError(null);
      const response = await loginApi(data);
      setSuccess(true);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error, success };
};