// services/api.js - Axios instance with auth interceptor
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
  // Send the httpOnly auth cookie with every request (web)
  withCredentials: true,
});

// Attach the Bearer token (native apps / WebViews where cross-site cookies are
// dropped). The backend accepts either the cookie or this header.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('liferemind_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses globally (auto-logout on expired/invalid session)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('liferemind_token');
      // Redirect to login unless already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
