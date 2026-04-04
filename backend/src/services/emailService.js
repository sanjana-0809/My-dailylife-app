// services/emailService.js - Optional email reminder service (placeholder)
// Implement with nodemailer or SendGrid if needed in future phases

/**
 * Send an email reminder.
 * Currently a placeholder — implement when email notifications are needed.
 */
const sendEmailReminder = async (to, subject, body) => {
  console.log(`[Email] Placeholder — would send to ${to}: ${subject}`);
  // TODO: Implement with nodemailer or SendGrid
  return false;
};

module.exports = { sendEmailReminder };
