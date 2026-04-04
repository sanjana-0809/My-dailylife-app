// App.jsx - Root component with routing
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { RemindersProvider } from './context/RemindersContext';
import Navigation from './components/Navigation';
import Login from './pages/Login';
import Today from './pages/Today';
import CalendarPage from './pages/Calendar';
import Habits from './pages/Habits';
import Reminders from './pages/Reminders';
import Archive from './pages/Archive';

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Layout with navigation
const AppLayout = ({ children }) => (
  <>
    <Navigation />
    <main className="pt-20 pb-8 px-4 lg:pl-60 lg:pr-6 max-w-4xl lg:max-w-3xl mx-auto lg:mx-0 lg:ml-56">
      {children}
    </main>
  </>
);

const AppRoutes = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />

      <Route path="/" element={
        <ProtectedRoute>
          <RemindersProvider>
            <AppLayout><Today /></AppLayout>
          </RemindersProvider>
        </ProtectedRoute>
      } />

      <Route path="/calendar" element={
        <ProtectedRoute>
          <RemindersProvider>
            <AppLayout><CalendarPage /></AppLayout>
          </RemindersProvider>
        </ProtectedRoute>
      } />

      <Route path="/habits" element={
        <ProtectedRoute>
          <AppLayout><Habits /></AppLayout>
        </ProtectedRoute>
      } />

      <Route path="/reminders" element={
        <ProtectedRoute>
          <RemindersProvider>
            <AppLayout><Reminders /></AppLayout>
          </RemindersProvider>
        </ProtectedRoute>
      } />

      <Route path="/archive" element={
        <ProtectedRoute>
          <RemindersProvider>
            <AppLayout><Archive /></AppLayout>
          </RemindersProvider>
        </ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <AppRoutes />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { borderRadius: '12px', fontFamily: 'DM Sans, sans-serif', fontSize: '14px' },
        }}
      />
    </AuthProvider>
  </BrowserRouter>
);

export default App;
