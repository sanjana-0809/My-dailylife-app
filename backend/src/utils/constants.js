// utils/constants.js - Application constants

module.exports = {
  REMINDER_STATUSES: ['active', 'completed', 'snoozed'],
  HABIT_FREQUENCIES: ['daily', 'weekly', 'monthly'],
  MAX_UPLOAD_SIZE: 10 * 1024 * 1024, // 10MB max audio file
  PAGINATION_DEFAULT_LIMIT: 50,
  JWT_EXPIRY: '7d',
};
