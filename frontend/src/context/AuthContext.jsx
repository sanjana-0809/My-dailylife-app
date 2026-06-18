// context/AuthContext.jsx - Authentication state management
// Uses a Bearer token (works in native WebViews where cross-site cookies are
// dropped); the backend also accepts the httpOnly cookie on web.
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/auth';

const AuthContext = createContext(null);
const TOKEN_KEY = 'liferemind_token';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount: if we have a stored token, validate it via /auth/me
  useEffect(() => {
    let active = true;
    (async () => {
      if (!localStorage.getItem(TOKEN_KEY)) {
        if (active) setLoading(false);
        return;
      }
      try {
        const profile = await authService.getProfile();
        if (active) setUser({ id: profile.id, email: profile.email, name: profile.name });
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        if (active) setUser(null);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await authService.login(email, password);
    if (data.token) localStorage.setItem(TOKEN_KEY, data.token);
    setUser({ id: data.id, email: data.email, name: data.name });
    return data;
  }, []);

  const register = useCallback(async (email, password, name) => {
    const data = await authService.register(email, password, name);
    if (data.token) localStorage.setItem(TOKEN_KEY, data.token);
    setUser({ id: data.id, email: data.email, name: data.name });
    return data;
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
