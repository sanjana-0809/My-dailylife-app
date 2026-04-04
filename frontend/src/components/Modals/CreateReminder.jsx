// components/Modals/CreateReminder.jsx - Modal for creating new reminders
import React, { useState } from 'react';
import { FiX, FiMic, FiType } from 'react-icons/fi';
import { useRemindersContext } from '../../context/RemindersContext';
import Button from '../Common/Button';
import Input from '../Common/Input';
import toast from 'react-hot-toast';

const CreateReminder = ({ onClose }) => {
  const { createReminder } = useRemindersContext();
  const [mode, setMode] = useState('natural'); // 'natural' or 'manual'
  const [loading, setLoading] = useState(false);

  // Natural language input
  const [naturalText, setNaturalText] = useState('');

  // Manual input
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('09:00');
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState('daily');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'natural') {
        if (!naturalText.trim()) {
          toast.error('Please describe your reminder');
          setLoading(false);
          return;
        }
        await createReminder({ naturalText });
        toast.success('Reminder created!');
      } else {
        if (!title.trim() || !dueDate) {
          toast.error('Title and date are required');
          setLoading(false);
          return;
        }
        await createReminder({
          title, due_date: dueDate, due_time: dueTime,
          is_recurring: isRecurring, frequency: isRecurring ? frequency : null,
        });
        toast.success('Reminder created!');
      }
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create reminder');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-slide-up" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-surface-100">
          <h3 className="text-lg font-semibold text-gray-800">New Reminder</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-100 text-gray-400 transition-colors">
            <FiX size={18} />
          </button>
        </div>

        {/* Mode Toggle */}
        <div className="flex gap-1 px-5 pt-4">
          <button
            onClick={() => setMode('natural')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors
              ${mode === 'natural' ? 'bg-brand-50 text-brand-600' : 'text-gray-500 hover:bg-surface-50'}`}
          >
            <FiMic size={14} /> Natural Language
          </button>
          <button
            onClick={() => setMode('manual')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors
              ${mode === 'manual' ? 'bg-brand-50 text-brand-600' : 'text-gray-500 hover:bg-surface-50'}`}
          >
            <FiType size={14} /> Manual
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {mode === 'natural' ? (
            <div>
              <textarea
                value={naturalText}
                onChange={(e) => setNaturalText(e.target.value)}
                placeholder='e.g., "Remind me to call Mom on March 15th at 7 PM" or "Submit report in 3 days"'
                className="w-full px-3 py-3 rounded-lg border border-surface-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none h-28"
                autoFocus
              />
              <p className="text-xs text-gray-400 mt-1">
                Just type naturally — dates, times, and recurrence are auto-detected
              </p>
            </div>
          ) : (
            <>
              <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What to remember" autoFocus />
              <div className="grid grid-cols-2 gap-3">
                <Input label="Date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                <Input label="Time" type="time" value={dueTime} onChange={(e) => setDueTime(e.target.value)} />
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={isRecurring} onChange={(e) => setIsRecurring(e.target.checked)}
                    className="w-4 h-4 rounded border-surface-300 text-brand-500 focus:ring-brand-400" />
                  <span className="text-sm text-gray-700">Recurring</span>
                </label>
                {isRecurring && (
                  <select value={frequency} onChange={(e) => setFrequency(e.target.value)}
                    className="text-sm border border-surface-200 rounded-lg px-3 py-1.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-400">
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                )}
              </div>
            </>
          )}

          <div className="flex gap-3 pt-2">
            <Button variant="secondary" type="button" onClick={onClose} className="flex-1">Cancel</Button>
            <Button type="submit" loading={loading} className="flex-1">Create Reminder</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateReminder;
