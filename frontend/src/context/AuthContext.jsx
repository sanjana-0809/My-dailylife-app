// context/AuthContext.jsx - Authentication state management
// The JWT lives in an httpOnly cookie (not readable by JS), so the session is
// restored by calling /auth/me rather than reading a token from localStorage.
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount: restore session from the auth cookie via /auth/me
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const profile = await authService.getProfile();
        if (active) setUser({ id: profile.id, email: profile.email, name: profile.name });
      } catch {
        if (active) setUser(null);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await authService.login(email, password);
    setUser({ id: data.id, email: data.email, name: data.name });
    return data;
  }, []);

  const register = useCallback(async (email, password, name) => {
    const data = await authService.register(email, password, name);
    setUser({ id: data.id, email: data.email, name: data.name });
    return data;
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
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
