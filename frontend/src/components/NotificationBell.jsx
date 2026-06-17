import React, { useState, useEffect, useRef } from 'react';
import { FiBell } from 'react-icons/fi';
import api from '../services/api';
import { timeago } from '../utils/timeago';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    api.get('/notifications/history', { params: { limit: 10 } })
      .then(({ data }) => setNotifications(data)).catch(() => {});
  }, [open]);

  useEffect(() => {
    const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const recentCount = notifications.filter(n => new Date(n.sent_at) > new Date(Date.now() - 86400000)).length;

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)} className="relative p-2 rounded-xl hover:bg-surface-light text-gray-400 hover:text-gray-200 transition-colors">
        <FiBell size={20} />
        {recentCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{recentCount}</span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-12 w-80 bg-dark-800 rounded-2xl shadow-2xl border border-dark-500 py-2 z-50 animate-scale-in max-h-96 overflow-y-auto">
          <h4 className="px-4 py-2 text-xs font-bold text-dark-300 uppercase tracking-wider border-b border-dark-600">Notifications</h4>
          {notifications.length === 0 ? (
            <p className="px-4 py-8 text-sm text-dark-300 text-center">No notifications yet</p>
          ) : notifications.map((n) => (
            <div key={n.id} className="px-4 py-3 hover:bg-surface-light border-b border-dark-600 last:border-0">
              <p className="text-sm text-gray-200">{n.reminder_title || n.habit_title || 'Notification'}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs font-medium ${n.delivery_status === 'success' ? 'text-brand-green' : 'text-red-400'}`}>{n.delivery_status}</span>
                <span className="text-xs text-dark-300">{timeago(n.sent_at)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
