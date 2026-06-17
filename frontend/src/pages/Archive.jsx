import React, { useEffect, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { useRemindersContext } from '../context/RemindersContext';
import ReminderCard from '../components/ReminderCard';
import Loading from '../components/Common/Loading';
import EmptyState from '../components/Common/EmptyState';

const Archive = () => {
  const { reminders, fetchReminders, loading } = useRemindersContext();
  const [search, setSearch] = useState('');

  useEffect(() => { fetchReminders('completed'); }, []); // eslint-disable-line

  const displayed = search.trim()
    ? reminders.filter(r => r.title.toLowerCase().includes(search.toLowerCase()))
    : reminders;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white font-display">Archive</h2>
        <p className="text-dark-300 text-sm mt-0.5">Completed reminders & past events</p>
      </div>

      <div className="relative">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-300" size={16} />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search archive..."
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-dark-500 bg-surface-mid text-gray-200 placeholder-dark-300 focus:outline-none focus:ring-2 focus:ring-brand-green/40 text-sm" />
      </div>

      {loading ? <Loading text="Loading archive..." /> : displayed.length === 0 ? (
        <EmptyState icon="📦" title="Archive empty" description="Completed reminders appear here" />
      ) : (
        <div className="space-y-3">
          {displayed.map((r, i) => (
            <div key={r.id} style={{ animationDelay: `${i * 0.03}s` }}>
              <ReminderCard reminder={r} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Archive;
