// services/notificationService.js - Push notification delivery + logging
const { sendPushNotification } = require('../config/firebase');
const { query } = require('../config/database');

/**
 * Send a push notification and log the result.
 * @param {object} params
 * @param {string} params.token - FCM device token
 * @param {string} params.title - Notification title
 * @param {string} params.body - Notification body
 * @param {number} params.userId - User ID for logging
 * @param {number|null} params.reminderId - Associated reminder ID
 * @param {number|null} params.habitId - Associated habit ID
 * @param {object} params.data - Extra data payload
 * @returns {Promise<boolean>} Whether the notification was sent successfully
 */
const sendNotification = async ({ token, title, body, userId, reminderId = null, habitId = null, data = {} }) => {
  let status = 'failed';
  let errorMessage = null;

  try {
    const messageId = await sendPushNotification(token, title, body, data);

    if (messageId) {
      status = 'success';
      console.log(`[Notify] ✓ Sent to user ${userId}: "${title}"`);
    } else {
      status = 'skipped';
      errorMessage = 'Firebase not initialized or no token';
      console.warn(`[Notify] ⚠ Skipped for user ${userId}: ${errorMessage}`);
    }
  } catch (err) {
    errorMessage = err.message;
    console.error(`[Notify] ✗ Failed for user ${userId}:`, errorMessage);
  }

  // Log every notification attempt for debugging
  try {
    await query(
      `INSERT INTO notification_logs (reminder_id, habit_id, user_id, delivery_status, error_message)
       VALUES ($1, $2, $3, $4, $5)`,
      [reminderId, habitId, userId, status, errorMessage]
    );
  } catch (logErr) {
    console.error('[Notify] Failed to write log:', logErr.message);
  }

  return status === 'success';
};

/**
 * Retry sending a notification with exponential backoff.
 * @param {object} params - Same as sendNotification
 * @param {number} maxRetries - Maximum retry attempts (default 3)
 */
const sendWithRetry = async (params, maxRetries = 3) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const success = await sendNotification(params);
    if (success) return true;

    if (attempt < maxRetries) {
      const delay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
      console.log(`[Notify] Retrying in ${delay / 1000}s (attempt ${attempt + 1}/${maxRetries})`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  return false;
};

module.exports = { sendNotification, sendWithRetry };
