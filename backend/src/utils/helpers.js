// utils/helpers.js - Common utility functions

/**
 * Format a PostgreSQL timestamp to a readable string.
 */
const formatTimestamp = (timestamp) => {
  if (!timestamp) return null;
  return new Date(timestamp).toISOString();
};

/**
 * Convert snake_case DB rows to camelCase for API responses.
 */
const toCamelCase = (obj) => {
  if (!obj) return obj;
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    result[camelKey] = value;
  }
  return result;
};

/**
 * Async route handler wrapper — catches errors and passes to errorHandler.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = { formatTimestamp, toCamelCase, asyncHandler };
