import axiosInstance from '../api/axiosInstance';
import type { AuthResponse, LoginRequest, MeResponse, SignupRequest } from '../types/auth';

export const signup = async (data: SignupRequest): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>('/auth/signup', data);
  return response.data;
};

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>('/auth/login', data);
  return response.data;
};

export const logout = async (): Promise<void> => {
  await axiosInstance.post('/auth/logout');
};

export const getMe = async (): Promise<MeResponse> => {
  const response = await axiosInstance.get<MeResponse>('/auth/me');
  return response.data;
};