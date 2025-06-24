import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const rawBaseUrl = import.meta.env.VITE_APP_API_URL || 'http://localhost:8000';
const API_BASE_URL = rawBaseUrl.endsWith('/api') ? rawBaseUrl : `${rawBaseUrl}/api`;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
});

let unauthorizedCallback: (() => void) | null = null;

export function setTokenCookie(token: string) {
  const expiresDays = 1;
  const d = new Date();
  d.setTime(d.getTime() + expiresDays * 24 * 60 * 60 * 1000);
  const isSecure = location.protocol === 'https:';
  document.cookie = `jwt_token=${token}; expires=${d.toUTCString()}; path=/; SameSite=Lax${isSecure ? '; Secure' : ''}`;
}

function getTokenCookie(): string | null {
  const name = 'jwt_token=';
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let c of ca) {
    c = c.trim();
    if (c.indexOf(name) === 0) {
      return c.substring(name.length);
    }
  }
  return null;
}

export const setOnUnauthorizedCallback = (callback: (() => void) | null) => {
  unauthorizedCallback = callback;
};

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getTokenCookie();
    if (token) {
      config.headers = config.headers ?? {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    const url = response.config.url || '';
    if (url.includes('/login') || url.includes('/register')) {
      const token = response.data?.access_token;
      if (token) {
        setTokenCookie(token);
      }
    }
    return response;
  },
  (error: AxiosError) => {
    const status = error.response?.status;
    const url = error.config?.url || '';

    const isLoginOrRegister = url.includes('/login') || url.includes('/register');
    const isLogout = url.includes('/logout');

    if (status === 401 && !isLoginOrRegister && !isLogout && unauthorizedCallback) {
      unauthorizedCallback();
    }

    if (error.response) {
      console.error('API Error:', status, error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Request setup error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
