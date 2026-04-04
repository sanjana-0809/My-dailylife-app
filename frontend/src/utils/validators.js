// utils/validators.js - Form validation helpers

export const validateEmail = (email) => {
  if (!email) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Invalid email format';
  return null;
};

export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  return null;
};

export const validateName = (name) => {
  if (!name || !name.trim()) return 'Name is required';
  return null;
};

export const validateReminder = (data) => {
  const errors = {};
  if (!data.title?.trim()) errors.title = 'Title is required';
  if (!data.due_date) errors.due_date = 'Date is required';
  return Object.keys(errors).length > 0 ? errors : null;
};
