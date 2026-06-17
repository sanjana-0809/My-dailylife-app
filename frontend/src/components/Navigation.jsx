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

  const handleLogout = async () => { await logout(); navigate('/login'); };

  return (
    <>
      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 h-16 glass-dark border-b border-dark-600 z-40 flex items-center px-4 lg:px-6">
        <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 rounded-xl hover:bg-surface-light text-gray-400 mr-2">
          {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>

        <div className="flex items-center gap-2.5">
          <img src="/logo.jpg" alt="LifeRemind" className="w-8 h-8 rounded-lg object-contain" />
          <h1 className="text-lg font-bold text-white tracking-tight font-display">LifeRemind</h1>
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          <NotificationBell />
          <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-dark-500 ml-2">
            <div className="w-8 h-8 rounded-full bg-brand-green/20 text-brand-green flex items-center justify-center text-sm font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <span className="text-sm font-medium text-gray-300 hidden md:block">{user?.name}</span>
          </div>
        </div>
      </header>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-16 bottom-0 w-56 bg-dark-800 border-r border-dark-600 flex-col z-30">
        <nav className="flex-1 p-3 space-y-1 mt-2">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                ${isActive ? 'bg-brand-green/15 text-brand-green' : 'text-dark-300 hover:bg-surface-light hover:text-gray-200'}`
              }>
              <Icon size={18} />{label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-dark-600">
          <button onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-dark-300 hover:bg-red-500/10 hover:text-red-400 w-full transition-colors">
            <FiLogOut size={18} />Logout
          </button>
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
          <aside className="fixed left-0 top-16 bottom-0 w-64 bg-dark-800 border-r border-dark-600 z-50 lg:hidden animate-slide-up">
            <nav className="p-3 space-y-1">
              {navItems.map(({ to, icon: Icon, label }) => (
                <NavLink key={to} to={to} onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
                    ${isActive ? 'bg-brand-green/15 text-brand-green' : 'text-dark-300 hover:bg-surface-light'}`
                  }>
                  <Icon size={18} />{label}
                </NavLink>
              ))}
            </nav>
            <div className="p-3 border-t border-dark-600">
              <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-dark-300 hover:bg-red-500/10 hover:text-red-400 w-full">
                <FiLogOut size={18} />Logout
              </button>
            </div>
          </aside>
        </>
      )}
    </>
  );
};

export default Navigation;
