import React, { useState } from 'react';
import { FiCheck, FiTrash2, FiEdit2 } from 'react-icons/fi';
import { formatTime } from '../utils/formatDate';
import toast from 'react-hot-toast';

const HabitTracker = ({ habit, onComplete, onDelete, onEdit }) => {
  const [loading, setLoading] = useState(false);

  const handleComplete = async () => {
    if (habit.completed_today) return;
    setLoading(true);
    try { await onComplete(habit.id); toast.success(`"${habit.title}" done!`); }
    catch { toast.error('Failed'); }
    finally { setLoading(false); }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${habit.title}"?`)) return;
    try { await onDelete(habit.id); toast.success('Deleted'); }
    catch { toast.error('Failed'); }
  };

  const streakEmoji = habit.streak_count >= 30 ? '🏆' : habit.streak_count >= 7 ? '🔥' : habit.streak_count >= 3 ? '⚡' : '💧';
  const progressPct = habit.completed_today ? 100 : 0;

  return (
    <div className={`group rounded-2xl p-4 transition-all duration-300 animate-slide-up
      ${habit.completed_today
        ? 'bg-brand-green/10 border border-brand-green/20'
        : 'bg-surface-mid border border-dark-500 hover:border-dark-400'}`}
    >
      <div className="flex items-center gap-3">
        <button onClick={handleComplete} disabled={habit.completed_today || loading}
          className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200
            ${habit.completed_today
              ? 'bg-brand-green text-dark-900 shadow-md shadow-brand-green/30'
              : 'border-2 border-dark-400 hover:border-brand-green hover:bg-brand-green/10 text-dark-400 hover:text-brand-green'}`}
        >
          {habit.completed_today && <FiCheck size={18} className="check-pop" />}
        </button>

        <div className="flex-1 min-w-0">
          <h4 className={`font-semibold leading-snug ${habit.completed_today ? 'text-brand-green' : 'text-gray-200'}`}>
            {habit.title}
          </h4>
          <p className="text-xs text-dark-300 mt-0.5 capitalize">{habit.frequency} · {formatTime(habit.due_time)}</p>
        </div>

        <div className="flex flex-col items-center px-2">
          <span className="text-lg">{streakEmoji}</span>
          <span className={`text-xs font-bold ${habit.streak_count > 0 ? 'text-brand-green' : 'text-dark-400'}`}>
            {habit.streak_count}d
          </span>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <button onClick={() => onEdit(habit)} className="p-1.5 rounded-lg hover:bg-surface-light text-dark-300 hover:text-gray-200"><FiEdit2 size={14} /></button>
          )}
          <button onClick={handleDelete} className="p-1.5 rounded-lg hover:bg-red-500/10 text-dark-300 hover:text-red-400"><FiTrash2 size={14} /></button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-3 h-1.5 bg-dark-500 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${habit.completed_today ? 'bg-brand-green' : 'bg-dark-400'}`}
          style={{ width: `${progressPct}%` }} />
      </div>
    </div>
  );
};

export default HabitTracker;
