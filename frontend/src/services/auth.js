// services/auth.js - Authentication API methods
import api from './api';

export const authService = {
  async register(email, password, name) {
    const { data } = await api.post('/auth/register', { email, password, name });
    return data;
  },

  async login(email, password) {
    const { data } = await api.post('/auth/login', { email, password });
    return data;
  },

  async getProfile() {
    const { data } = await api.get('/auth/me');
    return data;
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore network/401 errors — clearing local state still logs the user out
    }
  },

  async updatePhoneToken(phoneToken) {
    const { data } = await api.put('/auth/update-phone-token', { phoneToken });
    return data;
  },
};
