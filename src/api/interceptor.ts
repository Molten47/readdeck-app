import type {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios';

// ── Refresh queue ─────────────────────────────────────────────────
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (err: unknown) => void;
}> = [];

const processQueue = (error: unknown) => {
  failedQueue.forEach((p) => error ? p.reject(error) : p.resolve());
  failedQueue = [];
};

// ── Request interceptor ───────────────────────────────────────────
// No token to attach — cookie is sent automatically by browser
const onRequest = (config: InternalAxiosRequestConfig) => config;
const onRequestError = (error: AxiosError) => Promise.reject(error);

// ── Response interceptor ──────────────────────────────────────────
const onResponse = (response: AxiosResponse) => response;

const onResponseError = (instance: AxiosInstance) => async (error: AxiosError): Promise<unknown> => {
  const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

  // 401 = access token expired — try refresh
  if (error.response?.status === 401 && !originalRequest._retry) {
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(() => instance(originalRequest))
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Refresh token is in httpOnly cookie — sent automatically
      await instance.post('/auth/refresh');
      processQueue(null);
      return instance(originalRequest);

    } catch (refreshError) {
      // Refresh failed — session dead, redirect to login
      processQueue(refreshError);
      localStorage.removeItem('readdeck_user'); 
      window.location.href = '/login';
      return Promise.reject(refreshError);

    } finally {
      isRefreshing = false;
    }
  }

  return Promise.reject(error);
};

export const attachInterceptors = (instance: AxiosInstance): void => {
  instance.interceptors.request.use(onRequest, onRequestError);
  instance.interceptors.response.use(onResponse, onResponseError(instance));
};