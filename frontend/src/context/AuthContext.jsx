// context/AuthContext.jsx - Authentication state management
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount: restore session from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('liferemind_token');
    const storedUser = localStorage.getItem('liferemind_user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('liferemind_user');
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await authService.login(email, password);
    setUser({ id: data.id, email: data.email, name: data.name });
    setToken(data.token);
    localStorage.setItem('liferemind_token', data.token);
    localStorage.setItem('liferemind_user', JSON.stringify({ id: data.id, email: data.email, name: data.name }));
    return data;
  }, []);

  const register = useCallback(async (email, password, name) => {
    const data = await authService.register(email, password, name);
    setUser({ id: data.id, email: data.email, name: data.name });
    setToken(data.token);
    localStorage.setItem('liferemind_token', data.token);
    localStorage.setItem('liferemind_user', JSON.stringify({ id: data.id, email: data.email, name: data.name }));
    return data;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('liferemind_token');
    localStorage.removeItem('liferemind_user');
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
