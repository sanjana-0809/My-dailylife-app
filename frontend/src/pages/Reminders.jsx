// pages/Reminders.jsx - All reminders list with filters
import React, { useEffect, useState } from 'react';
import { FiPlus, FiSearch } from 'react-icons/fi';
import { useRemindersContext } from '../context/RemindersContext';
import ReminderCard from '../components/ReminderCard';
import CreateReminder from '../components/Modals/CreateReminder';
import Loading from '../components/Common/Loading';
import EmptyState from '../components/Common/EmptyState';
import Button from '../components/Common/Button';

const filters = [
  { label: 'All', value: undefined },
  { label: 'Active', value: 'active' },
  { label: 'Completed', value: 'completed' },
  { label: 'Snoozed', value: 'snoozed' },
];

const Reminders = () => {
  const { reminders, fetchReminders, loading } = useRemindersContext();
  const [activeFilter, setActiveFilter] = useState(undefined);
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    fetchReminders(activeFilter);
  }, [activeFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  // Client-side search filtering
  const displayed = search.trim()
    ? reminders.filter((r) => r.title.toLowerCase().includes(search.toLowerCase()))
    : reminders;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Reminders</h2>
        <Button onClick={() => setShowCreate(true)} size="sm">
          <FiPlus size={14} /> Add
        </Button>
      </div>

      {/* Search + Filters */}
      <div className="space-y-3">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reminders..."
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-surface-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent text-sm"
          />
        </div>

        <div className="flex gap-2">
          {filters.map((f) => (
            <button
              key={f.label}
              onClick={() => setActiveFilter(f.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                ${activeFilter === f.value
                  ? 'bg-brand-500 text-white'
                  : 'bg-surface-100 text-gray-600 hover:bg-surface-200'
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {loading ? (
        <Loading text="Loading reminders..." />
      ) : displayed.length === 0 ? (
        <EmptyState
          icon="📋"
          title={search ? 'No matching reminders' : 'No reminders found'}
          description={search ? 'Try a different search term' : 'Create your first reminder to get started'}
          action={!search && <Button onClick={() => setShowCreate(true)} size="sm"><FiPlus size={14} /> Create</Button>}
        />
      ) : (
        <div className="space-y-2">
          {displayed.map((r) => (
            <ReminderCard key={r.id} reminder={r} />
          ))}
        </div>
      )}

      {showCreate && <CreateReminder onClose={() => setShowCreate(false)} />}
    </div>
  );
};

export default Reminders;
