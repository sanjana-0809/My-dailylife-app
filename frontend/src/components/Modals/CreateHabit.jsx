// components/Modals/CreateHabit.jsx - Modal for creating new habits
import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';
import Button from '../Common/Button';
import Input from '../Common/Input';
import toast from 'react-hot-toast';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const CreateHabit = ({ onClose, onCreate }) => {
  const [title, setTitle] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [dueTime, setDueTime] = useState('09:00');
  const [daysOfWeek, setDaysOfWeek] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleDay = (dayIndex) => {
    setDaysOfWeek((prev) =>
      prev.includes(dayIndex) ? prev.filter((d) => d !== dayIndex) : [...prev, dayIndex].sort()
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Habit title is required');
      return;
    }
    setLoading(true);
    try {
      await onCreate({
        title: title.trim(),
        frequency,
        due_time: dueTime,
        days_of_week: frequency === 'weekly' ? daysOfWeek : null,
      });
      toast.success('Habit created!');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create habit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-surface-100">
          <h3 className="text-lg font-semibold text-gray-800">New Habit</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-100 text-gray-400">
            <FiX size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <Input label="Habit Name" value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder='e.g., "Drink 8 glasses of water"' autoFocus />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
            <div className="flex gap-2">
              {['daily', 'weekly', 'monthly'].map((f) => (
                <button key={f} type="button" onClick={() => setFrequency(f)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-colors
                    ${frequency === f ? 'bg-brand-500 text-white' : 'bg-surface-100 text-gray-600 hover:bg-surface-200'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {frequency === 'weekly' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Days of Week</label>
              <div className="flex gap-1.5">
                {DAYS.map((day, i) => (
                  <button key={day} type="button" onClick={() => toggleDay(i)}
                    className={`w-10 h-10 rounded-lg text-xs font-medium transition-colors
                      ${daysOfWeek.includes(i) ? 'bg-brand-500 text-white' : 'bg-surface-100 text-gray-600 hover:bg-surface-200'}`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          )}

          <Input label="Reminder Time" type="time" value={dueTime} onChange={(e) => setDueTime(e.target.value)} />

          <div className="flex gap-3 pt-2">
            <Button variant="secondary" type="button" onClick={onClose} className="flex-1">Cancel</Button>
            <Button type="submit" loading={loading} className="flex-1">Create Habit</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateHabit;
