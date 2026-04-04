// utils/timeago.js - Relative time formatting
import { formatDistanceToNow, parseISO } from 'date-fns';

/**
 * Format a timestamp to "X ago" format.
 */
export const timeago = (dateStr) => {
  if (!dateStr) return '';
  const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
  return formatDistanceToNow(date, { addSuffix: true });
};
