// components/ReminderCard.jsx - Single reminder display card
import React, { useState } from 'react';
import { FiCheck, FiClock, FiTrash2, FiEdit2 } from 'react-icons/fi';
import { formatDate, formatTime } from '../utils/formatDate';
import { useRemindersContext } from '../context/RemindersContext';
import toast from 'react-hot-toast';

const statusColors = {
  active: 'bg-brand-50 text-brand-700 border-brand-200',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  snoozed: 'bg-amber-50 text-amber-700 border-amber-200',
};

const ReminderCard = ({ reminder, onEdit }) => {
  const { markComplete, deleteReminder } = useRemindersContext();
  const [loading, setLoading] = useState(false);

  const handleComplete = async () => {
    setLoading(true);
    try {
      await markComplete(reminder.id);
      toast.success('Marked as done!');
    } catch {
      toast.error('Failed to update');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this reminder?')) return;
    try {
      await deleteReminder(reminder.id);
      toast.success('Reminder deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const isCompleted = reminder.status === 'completed';

  return (
    <div className={`group bg-white rounded-xl border border-surface-200 p-4 transition-all duration-200 hover:shadow-md hover:border-surface-300 animate-slide-up ${isCompleted ? 'opacity-60' : ''}`}>
      <div className="flex items-start gap-3">
        {/* Completion checkbox */}
        <button
          onClick={handleComplete}
          disabled={isCompleted || loading}
          className={`mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200
            ${isCompleted
              ? 'bg-accent-green border-accent-green text-white'
              : 'border-surface-300 hover:border-brand-400 hover:bg-brand-50'
            }`}
          aria-label="Mark complete"
        >
          {isCompleted && <FiCheck size={14} className="check-pop" />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className={`font-medium text-gray-800 leading-snug ${isCompleted ? 'line-through text-gray-400' : ''}`}>
            {reminder.title}
          </h4>
          {reminder.description && (
            <p className="text-sm text-gray-400 mt-0.5 truncate">{reminder.description}</p>
          )}
          <div className="flex items-center gap-3 mt-2">
            <span className="inline-flex items-center gap-1 text-xs text-gray-500">
              <FiClock size={12} />
              {formatDate(reminder.due_date)} · {formatTime(reminder.due_time)}
            </span>
            <span className={`inline-flex text-xs px-2 py-0.5 rounded-full border font-medium ${statusColors[reminder.status] || statusColors.active}`}>
              {reminder.status}
            </span>
            {reminder.is_recurring && (
              <span className="text-xs text-accent-purple font-medium">🔁 {reminder.frequency}</span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <button
              onClick={() => onEdit(reminder)}
              className="p-1.5 rounded-lg hover:bg-surface-100 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Edit"
            >
              <FiEdit2 size={14} />
            </button>
          )}
          <button
            onClick={handleDelete}
            className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-accent-red transition-colors"
            aria-label="Delete"
          >
            <FiTrash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReminderCard;
