// components/CalendarGrid.jsx - Month view calendar with reminder indicators
import React from 'react';
import Calendar from 'react-calendar';
import { format } from 'date-fns';
import 'react-calendar/dist/Calendar.css';

const CalendarGrid = ({ reminders = [], selectedDate, onDateSelect }) => {
  // Build a set of date strings that have reminders
  const reminderDates = new Set(
    reminders.map((r) => {
      const d = new Date(r.due_date);
      return format(d, 'yyyy-MM-dd');
    })
  );

  // Custom tile content: show dot if date has reminders
  const tileContent = ({ date, view }) => {
    if (view !== 'month') return null;
    const dateStr = format(date, 'yyyy-MM-dd');
    if (reminderDates.has(dateStr)) {
      return (
        <div className="flex justify-center mt-1">
          <div className="w-1.5 h-1.5 rounded-full bg-brand-500" />
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-surface-200 overflow-hidden">
      <Calendar
        onChange={onDateSelect}
        value={selectedDate}
        tileContent={tileContent}
        locale="en-US"
        className="!border-0 !w-full"
        navigationLabel={({ date }) => format(date, 'MMMM yyyy')}
      />
    </div>
  );
};

export default CalendarGrid;
