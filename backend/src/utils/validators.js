// utils/validators.js - Input validation helpers

/**
 * Validate email format.
 */
const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Validate password strength (min 8 chars).
 */
const isValidPassword = (password) => {
  return typeof password === 'string' && password.length >= 8;
};

/**
 * Validate date string (YYYY-MM-DD).
 */
const isValidDate = (dateStr) => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) return false;
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
};

/**
 * Validate time string (HH:MM or HH:MM:SS).
 */
const isValidTime = (timeStr) => {
  return /^\d{2}:\d{2}(:\d{2})?$/.test(timeStr);
};

/**
 * Validate reminder creation input.
 */
const validateReminderInput = (data) => {
  const errors = [];
  if (!data.title || data.title.trim().length === 0) errors.push('Title is required');
  if (!data.due_date && !data.dueDate) errors.push('Due date is required');
  if ((data.due_date || data.dueDate) && !isValidDate(data.due_date || data.dueDate)) errors.push('Invalid date format (use YYYY-MM-DD)');
  if ((data.due_time || data.dueTime) && !isValidTime(data.due_time || data.dueTime)) errors.push('Invalid time format (use HH:MM)');
  return errors;
};

/**
 * Validate habit creation input.
 */
const validateHabitInput = (data) => {
  const errors = [];
  if (!data.title || data.title.trim().length === 0) errors.push('Title is required');
  if (data.frequency && !['daily', 'weekly', 'monthly'].includes(data.frequency)) {
    errors.push('Frequency must be daily, weekly, or monthly');
  }
  return errors;
};

module.exports = {
  isValidEmail,
  isValidPassword,
  isValidDate,
  isValidTime,
  validateReminderInput,
  validateHabitInput,
};
