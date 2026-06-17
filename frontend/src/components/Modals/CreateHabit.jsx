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

  const toggleDay = (i) => setDaysOfWeek(prev => prev.includes(i) ? prev.filter(d => d !== i) : [...prev, i].sort());

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) { toast.error('Title required'); return; }
    setLoading(true);
    try {
      await onCreate({ title: title.trim(), frequency, due_time: dueTime, days_of_week: frequency === 'weekly' ? daysOfWeek : null });
      toast.success('Habit created!');
      onClose();
    } catch (err) { toast.error(err.response?.data?.error || 'Failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-dark-800 rounded-3xl shadow-2xl border border-dark-500 w-full max-w-md animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-dark-600">
          <h3 className="text-lg font-bold text-white font-display">New Habit</h3>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-surface-light text-dark-300"><FiX size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <Input label="Habit Name" value={title} onChange={e => setTitle(e.target.value)} placeholder='"Drink 8 glasses of water"' autoFocus />
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Frequency</label>
            <div className="flex gap-2">
              {['daily', 'weekly', 'monthly'].map(f => (
                <button key={f} type="button" onClick={() => setFrequency(f)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold capitalize transition-all
                    ${frequency === f ? 'bg-brand-green text-dark-900' : 'bg-surface-light text-gray-400 hover:bg-surface-lighter'}`}>
                  {f}
                </button>
              ))}
            </div>
          </div>
          {frequency === 'weekly' && (
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Days</label>
              <div className="flex gap-1.5">
                {DAYS.map((day, i) => (
                  <button key={day} type="button" onClick={() => toggleDay(i)}
                    className={`w-10 h-10 rounded-xl text-xs font-semibold transition-all
                      ${daysOfWeek.includes(i) ? 'bg-brand-green text-dark-900' : 'bg-surface-light text-gray-400 hover:bg-surface-lighter'}`}>
                    {day}
                  </button>
                ))}
              </div>
            </div>
          )}
          <Input label="Time" type="time" value={dueTime} onChange={e => setDueTime(e.target.value)} />
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" type="button" onClick={onClose} className="flex-1">Cancel</Button>
            <Button type="submit" loading={loading} className="flex-1">Create</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateHabit;
