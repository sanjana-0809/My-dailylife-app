// pages/Archive.jsx - Completed reminders archive
import React, { useEffect, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { useRemindersContext } from '../context/RemindersContext';
import ReminderCard from '../components/ReminderCard';
import Loading from '../components/Common/Loading';
import EmptyState from '../components/Common/EmptyState';

const Archive = () => {
  const { reminders, fetchReminders, loading } = useRemindersContext();
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchReminders('completed');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const displayed = search.trim()
    ? reminders.filter((r) => r.title.toLowerCase().includes(search.toLowerCase()))
    : reminders;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Archive</h2>
        <p className="text-gray-500 mt-0.5">Completed reminders and past events</p>
      </div>

      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search archive..."
          className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-surface-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-400 text-sm"
        />
      </div>

      {loading ? (
        <Loading text="Loading archive..." />
      ) : displayed.length === 0 ? (
        <EmptyState icon="📦" title="Archive is empty" description="Completed reminders will appear here" />
      ) : (
        <div className="space-y-2">
          {displayed.map((r) => (
            <ReminderCard key={r.id} reminder={r} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Archive;
