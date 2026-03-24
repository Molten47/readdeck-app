import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignup } from '../../hooks/useSignup';
import { useAuth } from '../../context/AuthContext';
import type { MeResponse } from '../../types/auth';

interface SignupFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const useSignupForm = () => {
  const navigate = useNavigate();
  const { signup, loading, error, success } = useSignup();
  const { setUser } = useAuth();

  const [formData, setFormData] = useState<SignupFormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [formErrors, setFormErrors] = useState<Partial<SignupFormData>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name as keyof SignupFormData]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const errors: Partial<SignupFormData> = {};

    if (!formData.username.trim()) errors.username = 'Username is required';
    else if (formData.username.length < 3) errors.username = 'Username must be at least 3 characters';

    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid';

    if (!formData.password) errors.password = 'Password is required';
    else if (formData.password.length < 8) errors.password = 'Password must be at least 8 characters';
    else if (!/[A-Z]/.test(formData.password)) errors.password = 'Password needs an uppercase letter';
    else if (!/[0-9]/.test(formData.password)) errors.password = 'Password needs a number';

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const response = await signup({
      username: formData.username,
      email: formData.email,
      password: formData.password,
    });

    if (response) {
      setUser({ 
        user_id: response.user_id,
        username: response.username,
        email: response.email,
        created_at: new Date().toISOString(),
      } as unknown as MeResponse);
      navigate('/dashboard')
    }
  };

  return { formData, formErrors, handleChange, handleSubmit, loading, error, success };
};