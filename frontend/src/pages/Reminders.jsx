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

  useEffect(() => { fetchReminders(activeFilter); }, [activeFilter]); // eslint-disable-line

  const displayed = search.trim()
    ? reminders.filter(r => r.title.toLowerCase().includes(search.toLowerCase()))
    : reminders;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white font-display">Reminders</h2>
        <Button onClick={() => setShowCreate(true)} size="sm"><FiPlus size={14} /> Add</Button>
      </div>

      <div className="space-y-3">
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-300" size={16} />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search reminders..."
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-dark-500 bg-surface-mid text-gray-200 placeholder-dark-300 focus:outline-none focus:ring-2 focus:ring-brand-green/40 focus:border-brand-green/50 text-sm" />
        </div>

        <div className="flex gap-2">
          {filters.map(f => (
            <button key={f.label} onClick={() => setActiveFilter(f.value)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all
                ${activeFilter === f.value
                  ? 'bg-brand-green text-dark-900'
                  : 'bg-surface-mid text-dark-300 hover:bg-surface-light border border-dark-500'}`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? <Loading text="Loading reminders..." /> : displayed.length === 0 ? (
        <EmptyState icon="📋" title={search ? 'No matches' : 'No reminders'}
          description={search ? 'Try different keywords' : 'Create your first reminder'}
          action={!search && <Button onClick={() => setShowCreate(true)} size="sm"><FiPlus size={14} /> Create</Button>} />
      ) : (
        <div className="space-y-3">
          {displayed.map((r, i) => (
            <div key={r.id} style={{ animationDelay: `${i * 0.03}s` }}>
              <ReminderCard reminder={r} />
            </div>
          ))}
        </div>
      )}

      {showCreate && <CreateReminder onClose={() => setShowCreate(false)} />}
    </div>
  );
};

export default Reminders;
