import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../../hooks/useLogin';
import { useAuth } from '../../context/AuthContext';
//import type { MeResponse } from '../../types/auth';
 import { setToken } from '../../api/interceptor';

interface LoginFormData {
  email: string;
  password: string;
}

export const useLoginForm = () => {
  const navigate = useNavigate();
  const { login, loading, error, success } = useLogin();
  const { setUser } = useAuth();

  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  const [formErrors, setFormErrors] = useState<Partial<LoginFormData>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name as keyof LoginFormData]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const errors: Partial<LoginFormData> = {};

    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid';
    if (!formData.password) errors.password = 'Password is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validate()) return;

  const response = await login(formData);

  if (response) {
    // Store the access token for Bearer auth
    setToken(response.access_token);

    setUser({
      user_id:    response.user_id,
      username:   response.username,
      email:      response.email,
      role:       response.role,
      created_at: new Date().toISOString(),
    });
    navigate('/dashboard');
  }
};

  return { formData, formErrors, handleChange, handleSubmit, loading, error, success };
};