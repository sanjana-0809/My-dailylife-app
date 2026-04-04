// pages/Calendar.jsx - Calendar view with reminders
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

  useEffect(() => {
    fetchReminders();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Filter reminders for selected date
  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
  const filteredReminders = reminders.filter((r) => {
    const rDate = new Date(r.due_date);
    return format(rDate, 'yyyy-MM-dd') === selectedDateStr;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Calendar</h2>
        <Button onClick={() => setShowCreate(true)} size="sm">
          <FiPlus size={14} /> Add
        </Button>
      </div>

      <CalendarGrid
        reminders={reminders}
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
      />

      <section>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          {format(selectedDate, 'EEEE, MMMM d')}
          {filteredReminders.length > 0 && (
            <span className="ml-2 text-sm font-normal text-gray-400">({filteredReminders.length})</span>
          )}
        </h3>

        {loading ? (
          <Loading />
        ) : filteredReminders.length === 0 ? (
          <EmptyState icon="📅" title="No reminders for this date" description="Select another date or create a reminder" />
        ) : (
          <div className="space-y-2">
            {filteredReminders.map((r) => (
              <ReminderCard key={r.id} reminder={r} />
            ))}
          </div>
        )}
      </section>

      {showCreate && <CreateReminder onClose={() => setShowCreate(false)} />}
    </div>
  );
};

export default CalendarPage;
