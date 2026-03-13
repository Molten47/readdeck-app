import axios from 'axios';
import { attachInterceptors } from './interceptor';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // sends httpOnly cookies automatically
});

attachInterceptors(axiosInstance);

export default axiosInstance;