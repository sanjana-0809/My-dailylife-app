// services/schedulerService.js - Background cron jobs for sending notifications
const cron = require('node-cron');
const Reminder = require('../models/Reminder');
const Habit = require('../models/Habit');
const { sendWithRetry } = require('./notificationService');
const { query } = require('../config/database');

/**
 * Start all scheduled background jobs.
 */
const startScheduler = () => {
  console.log('[Scheduler] Starting background jobs...');

  // ─── Job 1: Check due reminders — every minute ───
  cron.schedule('* * * * *', async () => {
    try {
      const dueReminders = await Reminder.findDueNow();

      if (dueReminders.length > 0) {
        console.log(`[Scheduler] Found ${dueReminders.length} due reminder(s)`);
      }

      for (const reminder of dueReminders) {
        await sendWithRetry({
          token: reminder.phone_token,
          title: '⏰ Reminder',
          body: reminder.title,
          userId: reminder.user_id,
          reminderId: reminder.id,
          data: {
            type: 'reminder',
            reminderId: String(reminder.id),
          },
        });

        // Mark as notified so we don't send again
        await Reminder.markNotified(reminder.id);
      }
    } catch (err) {
      console.error('[Scheduler] Reminder check failed:', err.message);
    }
  });

  // ─── Job 2: Check due habits — every minute ───
  cron.schedule('* * * * *', async () => {
    try {
      const dueHabits = await Habit.findDueNow();

      for (const habit of dueHabits) {
        await sendWithRetry({
          token: habit.phone_token,
          title: '✅ Habit Time',
          body: `Time for: ${habit.title}`,
          userId: habit.user_id,
          habitId: habit.id,
          data: {
            type: 'habit',
            habitId: String(habit.id),
          },
        });
      }
    } catch (err) {
      console.error('[Scheduler] Habit check failed:', err.message);
    }
  });

  // ─── Job 3: Midnight reset — reset all habits' completed_today ───
  cron.schedule('0 0 * * *', async () => {
    try {
      console.log('[Scheduler] Midnight: Resetting daily habits');
      await Habit.resetDaily();
    } catch (err) {
      console.error('[Scheduler] Midnight reset failed:', err.message);
    }
  });

  // ─── Job 4: Weekly summary — Sunday 8 AM ───
  cron.schedule('0 8 * * 0', async () => {
    try {
      console.log('[Scheduler] Sending weekly summaries');

      const result = await query(`
        SELECT u.id, u.name, u.phone_token,
          (SELECT COUNT(*) FROM reminders WHERE user_id = u.id AND status = 'completed' 
           AND updated_at >= CURRENT_DATE - INTERVAL '7 days') as completed_reminders,
          (SELECT COUNT(*) FROM habits WHERE user_id = u.id AND streak_count > 0) as active_habits
        FROM users u WHERE u.phone_token IS NOT NULL
      `);

      for (const user of result.rows) {
        await sendWithRetry({
          token: user.phone_token,
          title: '📊 Weekly Summary',
          body: `You completed ${user.completed_reminders} reminders & have ${user.active_habits} active habit streaks!`,
          userId: user.id,
          data: { type: 'weekly_summary' },
        });
      }
    } catch (err) {
      console.error('[Scheduler] Weekly summary failed:', err.message);
    }
  });

  // ─── Job 5: Cleanup old logs — daily at 2 AM ───
  cron.schedule('0 2 * * *', async () => {
    try {
      const result = await query(
        `DELETE FROM notification_logs WHERE sent_at < CURRENT_DATE - INTERVAL '30 days'`
      );
      console.log(`[Scheduler] Cleaned ${result.rowCount} old notification logs`);
    } catch (err) {
      console.error('[Scheduler] Log cleanup failed:', err.message);
    }
  });

  console.log('[Scheduler] All jobs registered ✓');
};

module.exports = { startScheduler };
