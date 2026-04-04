// components/HabitTracker.jsx - Habit streak display + completion
import React, { useState } from 'react';
import { FiCheck, FiTrash2, FiEdit2 } from 'react-icons/fi';
import { formatTime } from '../utils/formatDate';
import toast from 'react-hot-toast';

const HabitTracker = ({ habit, onComplete, onDelete, onEdit }) => {
  const [loading, setLoading] = useState(false);

  const handleComplete = async () => {
    if (habit.completed_today) return;
    setLoading(true);
    try {
      await onComplete(habit.id);
      toast.success(`"${habit.title}" done! 🔥`);
    } catch {
      toast.error('Failed to mark complete');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete habit "${habit.title}"?`)) return;
    try {
      await onDelete(habit.id);
      toast.success('Habit deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const streakEmoji = habit.streak_count >= 30 ? '🏆' : habit.streak_count >= 7 ? '🔥' : habit.streak_count >= 3 ? '⚡' : '💧';

  return (
    <div className={`group bg-white rounded-xl border p-4 transition-all duration-200 hover:shadow-md animate-slide-up
      ${habit.completed_today ? 'border-emerald-200 bg-emerald-50/30' : 'border-surface-200 hover:border-surface-300'}`}
    >
      <div className="flex items-center gap-3">
        {/* Completion button */}
        <button
          onClick={handleComplete}
          disabled={habit.completed_today || loading}
          className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200
            ${habit.completed_today
              ? 'bg-accent-green text-white shadow-sm'
              : 'border-2 border-surface-300 hover:border-accent-green hover:bg-emerald-50'
            }`}
          aria-label="Complete habit"
        >
          {habit.completed_today && <FiCheck size={16} className="check-pop" />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className={`font-medium leading-snug ${habit.completed_today ? 'text-emerald-700' : 'text-gray-800'}`}>
            {habit.title}
          </h4>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs text-gray-400 capitalize">{habit.frequency} · {formatTime(habit.due_time)}</span>
          </div>
        </div>

        {/* Streak */}
        <div className="flex flex-col items-center px-2">
          <span className="text-lg">{streakEmoji}</span>
          <span className={`text-xs font-bold ${habit.streak_count > 0 ? 'text-accent-amber' : 'text-gray-300'}`}>
            {habit.streak_count}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <button onClick={() => onEdit(habit)} className="p-1.5 rounded-lg hover:bg-surface-100 text-gray-400 hover:text-gray-600 transition-colors" aria-label="Edit">
              <FiEdit2 size={14} />
            </button>
          )}
          <button onClick={handleDelete} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-accent-red transition-colors" aria-label="Delete">
            <FiTrash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HabitTracker;
