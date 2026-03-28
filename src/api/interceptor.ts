import type {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios';

const TOKEN_KEY = 'readdeck_token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

// ── Refresh queue ─────────────────────────────────────────────────
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject:  (err: unknown)   => void;
}> = [];

const processQueue = (error: unknown) => {
  failedQueue.forEach(p => error ? p.reject(error) : p.resolve());
  failedQueue = [];
};

// ── Request interceptor — attach Bearer token ─────────────────────
const onRequest = (config: InternalAxiosRequestConfig) => {
  const token = getToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
};

const onRequestError = (error: AxiosError) => Promise.reject(error);

// ── Response interceptor ──────────────────────────────────────────
const onResponse = (response: AxiosResponse) => response;

const onResponseError = (instance: AxiosInstance) => async (error: AxiosError): Promise<unknown> => {
  const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

  if (error.response?.status === 401 && !originalRequest._retry) {
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => instance(originalRequest))
        .catch(err => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Refresh token is in httpOnly cookie — sent automatically
      // Response body contains the new access_token
      const res = await instance.post('/auth/refresh');
      const newToken = res.data?.access_token;

      if (newToken) {
        setToken(newToken);
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
      }

      processQueue(null);
      return instance(originalRequest);

    } catch (refreshError) {
      processQueue(refreshError);
      clearToken();
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