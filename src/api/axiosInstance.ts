import axios from 'axios';
import { attachInterceptors } from './interceptor';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

attachInterceptors(axiosInstance);

export default axiosInstance;

// Separate instance for background/silent calls — 401s do NOT trigger logout
export const silentAxios = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});
// No interceptors attached — failures are silent