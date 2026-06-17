import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useRemindersContext } from '../context/RemindersContext';
import CalendarGrid from '../components/CalendarGrid';
import ReminderCard from '../components/ReminderCard';
import CreateReminder from '../components/Modals/CreateReminder';
import Loading from '../components/Common/Loading';
import EmptyState from '../components/Common/EmptyState';
import Button from '../components/Common/Button';
import { FiPlus } from 'react-icons/fi';

const CalendarPage = () => {
  const { reminders, fetchReminders, loading } = useRemindersContext();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => { fetchReminders(); }, []); // eslint-disable-line

  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
  const filtered = reminders.filter(r => format(new Date(r.due_date), 'yyyy-MM-dd') === selectedDateStr);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white font-display">Calendar</h2>
        <Button onClick={() => setShowCreate(true)} size="sm"><FiPlus size={14} /> Add</Button>
      </div>
      <CalendarGrid reminders={reminders} selectedDate={selectedDate} onDateSelect={setSelectedDate} />
      <section>
        <h3 className="text-sm font-bold text-dark-300 uppercase tracking-wider mb-3">
          {format(selectedDate, 'EEEE, MMMM d')}
          {filtered.length > 0 && <span className="ml-2 text-brand-green">({filtered.length})</span>}
        </h3>
        {loading ? <Loading /> : filtered.length === 0 ? (
          <EmptyState icon="📅" title="No reminders" description="Select another date or create one" />
        ) : (
          <div className="space-y-3">{filtered.map(r => <ReminderCard key={r.id} reminder={r} />)}</div>
        )}
      </section>
      {showCreate && <CreateReminder onClose={() => setShowCreate(false)} />}
    </div>
  );
};

export default CalendarPage;
