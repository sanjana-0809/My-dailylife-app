// components/NotificationBell.jsx - Notification icon with unread count
import React, { useState, useEffect, useRef } from 'react';
import { FiBell } from 'react-icons/fi';
import api from '../services/api';
import { timeago } from '../utils/timeago';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await api.get('/notifications/history', { params: { limit: 10 } });
        setNotifications(data);
      } catch {
        // Silently fail
      }
    };
    fetchNotifications();
  }, [open]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const recentCount = notifications.filter(
    (n) => new Date(n.sent_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)
  ).length;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg hover:bg-surface-100 text-gray-500 hover:text-gray-700 transition-colors"
        aria-label="Notifications"
      >
        <FiBell size={20} />
        {recentCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent-red text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {recentCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-xl border border-surface-200 py-2 z-50 animate-slide-up max-h-96 overflow-y-auto">
          <h4 className="px-4 py-2 text-sm font-semibold text-gray-600 border-b border-surface-100">Notifications</h4>
          {notifications.length === 0 ? (
            <p className="px-4 py-6 text-sm text-gray-400 text-center">No notifications yet</p>
          ) : (
            notifications.map((n) => (
              <div key={n.id} className="px-4 py-3 hover:bg-surface-50 border-b border-surface-100 last:border-0">
                <p className="text-sm text-gray-700">{n.reminder_title || n.habit_title || 'Notification'}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs font-medium ${n.delivery_status === 'success' ? 'text-accent-green' : 'text-accent-red'}`}>
                    {n.delivery_status}
                  </span>
                  <span className="text-xs text-gray-400">{timeago(n.sent_at)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
