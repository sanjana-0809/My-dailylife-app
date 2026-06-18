import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiHome, FiCalendar, FiCheckSquare, FiList, FiArchive, FiLogOut } from 'react-icons/fi';
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

  const handleLogout = async () => { await logout(); navigate('/login'); };

  return (
    <>
      {/* Top bar — padded for the device status bar / notch */}
      <header className="fixed top-0 left-0 right-0 z-40 glass-dark border-b border-dark-600 safe-top">
        <div className="h-16 flex items-center px-4 lg:px-6">
          <div className="flex items-center gap-2.5">
            <img src="/logo.jpg" alt="LifeRemind" className="w-8 h-8 rounded-lg object-contain" />
            <h1 className="text-lg font-bold text-white tracking-tight font-display">LifeRemind</h1>
          </div>

          <div className="flex-1" />

          <div className="flex items-center gap-2">
            <NotificationBell />
            <div className="flex items-center gap-2 pl-2 sm:pl-3 sm:border-l border-dark-500 ml-1 sm:ml-2">
              <div className="w-8 h-8 rounded-full bg-brand-green/20 text-brand-green flex items-center justify-center text-sm font-bold">
                {user?.name?.charAt(0)?.toUpperCase() || '?'}
              </div>
              <span className="text-sm font-medium text-gray-300 hidden md:block">{user?.name}</span>
            </div>
            {/* Logout — visible on mobile (desktop has it in the sidebar) */}
            <button onClick={handleLogout} aria-label="Logout"
              className="lg:hidden p-2 rounded-xl hover:bg-red-500/10 text-dark-300 hover:text-red-400 transition-colors">
              <FiLogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-16 bottom-0 w-56 bg-dark-800 border-r border-dark-600 flex-col z-30">
        <nav className="flex-1 p-3 space-y-1 mt-2">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} end={to === '/'}
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

      {/* Mobile bottom tab bar — padded for the gesture/nav bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 glass-dark border-t border-dark-600 safe-bottom">
        <div className="flex items-stretch justify-around h-16">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} end={to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center flex-1 gap-1 text-[10px] font-medium transition-colors
                ${isActive ? 'text-brand-green' : 'text-dark-300'}`
              }>
              <Icon size={20} />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
};

export default Navigation;
