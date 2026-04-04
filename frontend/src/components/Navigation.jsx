// components/Navigation.jsx - App navigation
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiHome, FiCalendar, FiCheckSquare, FiList, FiArchive, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import NotificationBell from './NotificationBell';

const navItems = [
  { to: '/', icon: FiHome, label: 'Today' },
  { to: '/calendar', icon: FiCalendar, label: 'Calendar' },
  { to: '/habits', icon: FiCheckSquare, label: 'Habits' },
  { to: '/reminders', icon: FiList, label: 'Reminders' },
  { to: '/archive', icon: FiArchive, label: 'Archive' },
];

const Navigation = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* ─── Top Bar (mobile + desktop) ─── */}
      <header className="fixed top-0 left-0 right-0 h-16 glass border-b border-surface-200 z-40 flex items-center px-4 lg:px-6">
        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 rounded-lg hover:bg-surface-100 text-gray-600 mr-2"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>

        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-xl">⏰</span>
          <h1 className="text-lg font-bold text-gray-800 tracking-tight">LifeRemind</h1>
        </div>

        <div className="flex-1" />

        {/* Right side: notifications + user */}
        <div className="flex items-center gap-2">
          <NotificationBell />
          <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-surface-200 ml-2">
            <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-sm font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <span className="text-sm font-medium text-gray-700 hidden md:block">{user?.name}</span>
          </div>
        </div>
      </header>

      {/* ─── Sidebar (desktop) ─── */}
      <aside className="hidden lg:flex fixed left-0 top-16 bottom-0 w-56 bg-white border-r border-surface-200 flex-col z-30">
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150
                ${isActive
                  ? 'bg-brand-50 text-brand-600'
                  : 'text-gray-600 hover:bg-surface-50 hover:text-gray-800'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-surface-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-accent-red w-full transition-colors"
          >
            <FiLogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* ─── Mobile Drawer ─── */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
          <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-surface-200 z-50 lg:hidden animate-slide-up">
            <nav className="p-3 space-y-1">
              {navItems.map(({ to, icon: Icon, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                    ${isActive ? 'bg-brand-50 text-brand-600' : 'text-gray-600 hover:bg-surface-50'}`
                  }
                >
                  <Icon size={18} />
                  {label}
                </NavLink>
              ))}
            </nav>
            <div className="p-3 border-t border-surface-100">
              <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-accent-red w-full transition-colors">
                <FiLogOut size={18} />
                Logout
              </button>
            </div>
          </aside>
        </>
      )}
    </>
  );
};

export default Navigation;
