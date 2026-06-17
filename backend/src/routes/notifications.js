// routes/notifications.js - Handle notification actions (done, snooze)
const express = require('express');
const router = express.Router();
const Reminder = require('../models/Reminder');
const { authenticate } = require('../middleware/auth');
const { asyncHandler } = require('../utils/helpers');
const { query } = require('../config/database');

router.use(authenticate);

// PATCH /api/notifications/:reminderId/done — Mark reminder done from notification
router.patch('/:reminderId/done', asyncHandler(async (req, res) => {
  const reminder = await Reminder.markComplete(req.params.reminderId, req.user.id);
  if (!reminder) {
    return res.status(404).json({ error: 'Reminder not found' });
  }
  res.json({ success: true, reminder });
}));

// PATCH /api/notifications/:reminderId/snooze — Snooze reminder (delay by 15 min)
router.patch('/:reminderId/snooze', asyncHandler(async (req, res) => {
  // Validate snooze duration: positive integer, capped at 24h
  const minutes = Math.min(Math.max(parseInt(req.body.minutes) || 15, 1), 1440);

  const result = await query(
    `UPDATE reminders
     SET due_time = due_time + ($1 || ' minutes')::interval,
         last_notified = NULL,
         status = 'active',
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $2 AND user_id = $3
     RETURNING *`,
    [minutes, req.params.reminderId, req.user.id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Reminder not found' });
  }

  res.json({ success: true, reminder: result.rows[0], snoozedMinutes: minutes });
}));

// GET /api/notifications/history — Notification delivery history
router.get('/history', asyncHandler(async (req, res) => {
  const limit = Math.min(Math.max(parseInt(req.query.limit) || 20, 1), 100);

  const result = await query(
    `SELECT nl.*, r.title as reminder_title, h.title as habit_title
     FROM notification_logs nl
     LEFT JOIN reminders r ON nl.reminder_id = r.id
     LEFT JOIN habits h ON nl.habit_id = h.id
     WHERE nl.user_id = $1
     ORDER BY nl.sent_at DESC
     LIMIT $2`,
    [req.user.id, parseInt(limit)]
  );

  res.json(result.rows);
}));

module.exports = router;
