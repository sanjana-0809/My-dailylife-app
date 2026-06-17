import React, { useState } from 'react';
import { FiCheck, FiClock, FiTrash2, FiEdit2, FiMoreVertical } from 'react-icons/fi';
import { formatDate, formatTime } from '../utils/formatDate';
import { useRemindersContext } from '../context/RemindersContext';
import toast from 'react-hot-toast';

const cardStyles = {
  active: {
    bg: 'bg-card-green/90',
    text: 'text-dark-900',
    subtext: 'text-dark-700',
    badge: 'bg-dark-900/20 text-dark-900',
    icon: 'text-dark-900/60',
    border: 'border-card-green/20',
  },
  completed: {
    bg: 'bg-card-cyan/90',
    text: 'text-dark-900',
    subtext: 'text-dark-700',
    badge: 'bg-dark-900/20 text-dark-900',
    icon: 'text-dark-900/60',
    border: 'border-card-cyan/20',
  },
  snoozed: {
    bg: 'bg-card-pink/90',
    text: 'text-dark-900',
    subtext: 'text-dark-700',
    badge: 'bg-dark-900/20 text-dark-900',
    icon: 'text-dark-900/60',
    border: 'border-card-pink/20',
  },
};

const statusLabels = {
  active: 'Running',
  completed: 'Completed',
  snoozed: 'Snoozed',
};

const ReminderCard = ({ reminder, onEdit, style = 'timeline' }) => {
  const { markComplete, deleteReminder } = useRemindersContext();
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const colors = cardStyles[reminder.status] || cardStyles.active;

  const handleComplete = async () => {
    setLoading(true);
    try { await markComplete(reminder.id); toast.success('Done!'); }
    catch { toast.error('Failed'); }
    finally { setLoading(false); setShowMenu(false); }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this reminder?')) return;
    try { await deleteReminder(reminder.id); toast.success('Deleted'); }
    catch { toast.error('Failed'); }
    setShowMenu(false);
  };

  const isCompleted = reminder.status === 'completed';

  return (
    <div className={`relative ${colors.bg} rounded-2xl p-5 transition-all duration-300 hover:scale-[1.01] animate-slide-up`}>
      {/* Status badge */}
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs font-bold px-3 py-1 rounded-full ${colors.badge}`}>
          {statusLabels[reminder.status] || 'Active'}
        </span>

        {/* Menu button */}
        <div className="relative">
          <button onClick={() => setShowMenu(!showMenu)} className={`p-1 rounded-lg hover:bg-dark-900/10 ${colors.icon}`}>
            <FiMoreVertical size={18} />
          </button>
          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-8 bg-dark-800 rounded-xl shadow-2xl border border-dark-500 py-1 z-20 w-36 animate-scale-in">
                {!isCompleted && (
                  <button onClick={handleComplete} disabled={loading}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-300 hover:bg-surface-light">
                    <FiCheck size={14} /> Mark done
                  </button>
                )}
                {onEdit && (
                  <button onClick={() => { onEdit(reminder); setShowMenu(false); }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-300 hover:bg-surface-light">
                    <FiEdit2 size={14} /> Edit
                  </button>
                )}
                <button onClick={handleDelete}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-red-500/10">
                  <FiTrash2 size={14} /> Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-xl bg-dark-900/15 flex items-center justify-center flex-shrink-0`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={colors.icon}>
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            <path d="M9 14l2 2 4-4" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className={`font-bold text-lg leading-tight ${colors.text} ${isCompleted ? 'line-through opacity-70' : ''}`}>
            {reminder.title}
          </h4>
          {reminder.description && (
            <p className={`text-sm mt-0.5 ${colors.subtext} truncate`}>{reminder.description}</p>
          )}
        </div>
      </div>

      {/* Time info */}
      <div className={`flex items-center gap-2 mt-3 ${colors.subtext}`}>
        <FiClock size={12} />
        <span className="text-xs font-medium">{formatDate(reminder.due_date)} · {formatTime(reminder.due_time)}</span>
        {reminder.is_recurring && <span className="text-xs font-medium ml-2">🔁 {reminder.frequency}</span>}
      </div>
    </div>
  );
};

export default ReminderCard;
