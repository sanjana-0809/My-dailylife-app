// utils/formatDate.js - Date formatting utilities
import { format, parseISO, isToday, isTomorrow, isYesterday } from 'date-fns';

/**
 * Format a date string to a human-readable form.
 * Shows "Today", "Tomorrow", "Yesterday" when applicable.
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;

  if (isToday(date)) return 'Today';
  if (isTomorrow(date)) return 'Tomorrow';
  if (isYesterday(date)) return 'Yesterday';

  return format(date, 'MMM d, yyyy');
};

/**
 * Format a time string (HH:MM) to 12-hour format.
 */
export const formatTime = (timeStr) => {
  if (!timeStr) return '';
  const [hours, minutes] = timeStr.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const h = hours % 12 || 12;
  return `${h}:${String(minutes).padStart(2, '0')} ${period}`;
};

/**
 * Format duration in seconds to MM:SS.
 */
export const formatDuration = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
};
