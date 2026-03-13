import { useState } from 'react';
import { signup as signupApi } from '../auth/auth';
import type { AuthResponse, SignupRequest } from '../types/auth';

export const useSignup = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const signup = async (data: SignupRequest): Promise<AuthResponse | null> => {
    try {
      setLoading(true);
      setError(null);
      const response = await signupApi(data);
      setSuccess(true);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { signup, loading, error, success };
};