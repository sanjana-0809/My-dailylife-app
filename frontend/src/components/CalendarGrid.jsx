import React from 'react';
import Calendar from 'react-calendar';
import { format } from 'date-fns';
import 'react-calendar/dist/Calendar.css';

const CalendarGrid = ({ reminders = [], selectedDate, onDateSelect }) => {
  const reminderDates = new Set(reminders.map(r => format(new Date(r.due_date), 'yyyy-MM-dd')));

  const tileContent = ({ date, view }) => {
    if (view !== 'month') return null;
    if (reminderDates.has(format(date, 'yyyy-MM-dd'))) {
      return <div className="flex justify-center mt-1"><div className="w-1.5 h-1.5 rounded-full bg-brand-green" /></div>;
    }
    return null;
  };

  return (
    <div className="bg-surface-mid rounded-2xl border border-dark-500 overflow-hidden">
      <Calendar onChange={onDateSelect} value={selectedDate} tileContent={tileContent} locale="en-US"
        className="!border-0 !w-full" navigationLabel={({ date }) => format(date, 'MMMM yyyy')} />
    </div>
  );
};

export default CalendarGrid;
