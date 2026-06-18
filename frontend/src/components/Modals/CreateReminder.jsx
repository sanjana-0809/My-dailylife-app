import React, { useState } from 'react';
import { FiX, FiMic, FiType } from 'react-icons/fi';
import { useRemindersContext } from '../../context/RemindersContext';
import Button from '../Common/Button';
import Input from '../Common/Input';
import toast from 'react-hot-toast';

const CreateReminder = ({ onClose }) => {
  const { createReminder } = useRemindersContext();
  const [mode, setMode] = useState('natural');
  const [loading, setLoading] = useState(false);
  const [naturalText, setNaturalText] = useState('');
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
        if (!naturalText.trim()) { toast.error('Describe your reminder'); setLoading(false); return; }
        await createReminder({ naturalText });
      } else {
        if (!title.trim() || !dueDate) { toast.error('Title and date required'); setLoading(false); return; }
        await createReminder({ title, due_date: dueDate, due_time: dueTime, is_recurring: isRecurring, frequency: isRecurring ? frequency : null });
      }
      toast.success('Reminder created!');
      onClose();
    } catch (err) { toast.error(err.response?.data?.error || 'Failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-dark-800 rounded-3xl shadow-2xl border border-dark-500 w-full max-w-md max-h-[90vh] overflow-y-auto animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-dark-600">
          <h3 className="text-lg font-bold text-white font-display">New Reminder</h3>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-surface-light text-dark-300"><FiX size={18} /></button>
        </div>

        <div className="flex gap-1 px-5 pt-4">
          <button onClick={() => setMode('natural')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-colors
              ${mode === 'natural' ? 'bg-brand-green/15 text-brand-green' : 'text-dark-300 hover:bg-surface-light'}`}>
            <FiMic size={14} /> Natural
          </button>
          <button onClick={() => setMode('manual')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-colors
              ${mode === 'manual' ? 'bg-brand-green/15 text-brand-green' : 'text-dark-300 hover:bg-surface-light'}`}>
            <FiType size={14} /> Manual
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {mode === 'natural' ? (
            <div>
              <textarea value={naturalText} onChange={e => setNaturalText(e.target.value)}
                placeholder='"Call Mom on her birthday at 7 PM" or "Submit report in 3 days"'
                className="w-full px-4 py-3 rounded-xl border border-dark-500 bg-surface-dark text-gray-100 placeholder-dark-300 focus:outline-none focus:ring-2 focus:ring-brand-green/40 resize-none h-28"
                autoFocus />
              <p className="text-xs text-dark-300 mt-1.5">Dates, times & recurrence auto-detected</p>
            </div>
          ) : (
            <>
              <Input label="Title" value={title} onChange={e => setTitle(e.target.value)} placeholder="What to remember" autoFocus />
              <div className="grid grid-cols-2 gap-3">
                <Input label="Date" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
                <Input label="Time" type="time" value={dueTime} onChange={e => setDueTime(e.target.value)} />
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={isRecurring} onChange={e => setIsRecurring(e.target.checked)}
                    className="w-4 h-4 rounded border-dark-400 bg-surface-dark text-brand-green focus:ring-brand-green/40" />
                  <span className="text-sm text-gray-300">Recurring</span>
                </label>
                {isRecurring && (
                  <select value={frequency} onChange={e => setFrequency(e.target.value)}
                    className="text-sm border border-dark-500 rounded-xl px-3 py-1.5 bg-surface-dark text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-green/40">
                    <option value="daily">Daily</option><option value="weekly">Weekly</option><option value="monthly">Monthly</option>
                  </select>
                )}
              </div>
            </>
          )}
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" type="button" onClick={onClose} className="flex-1">Cancel</Button>
            <Button type="submit" loading={loading} className="flex-1">Create</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateReminder;
