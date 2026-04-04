// routes/dashboard.js - Dashboard / Today's view endpoint
const express = require('express');
const router = express.Router();
const Reminder = require('../models/Reminder');
const Habit = require('../models/Habit');
const { authenticate } = require('../middleware/auth');
const { asyncHandler } = require('../utils/helpers');
const { query } = require('../config/database');

router.use(authenticate);

// GET /api/dashboard — Today's reminders + habits + stats
router.get('/', asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const today = new Date().toISOString().split('T')[0];

  // Fetch today's reminders
  const todayReminders = await Reminder.findToday(userId);

  // Fetch all habits
  const habits = await Habit.findByUser(userId);

  // Fetch upcoming reminders (next 7 days)
  const upcomingResult = await query(
    `SELECT * FROM reminders
     WHERE user_id = $1 AND due_date > CURRENT_DATE AND due_date <= CURRENT_DATE + INTERVAL '7 days'
       AND status = 'active'
     ORDER BY due_date ASC, due_time ASC
     LIMIT 10`,
    [userId]
  );

  // Stats: completed this week
  const statsResult = await query(
    `SELECT
       (SELECT COUNT(*) FROM reminders WHERE user_id = $1 AND status = 'completed' 
        AND updated_at >= CURRENT_DATE - INTERVAL '7 days') as completed_this_week,
       (SELECT COUNT(*) FROM reminders WHERE user_id = $1 AND status = 'active') as active_reminders,
       (SELECT COUNT(*) FROM habits WHERE user_id = $1) as total_habits,
       (SELECT COALESCE(MAX(streak_count), 0) FROM habits WHERE user_id = $1) as best_streak`,
    [userId]
  );

  res.json({
    today,
    greeting: getGreeting(req.user.name),
    reminders: todayReminders,
    habits,
    upcoming: upcomingResult.rows,
    stats: statsResult.rows[0],
  });
}));

/**
 * Generate a time-appropriate greeting.
 */
function getGreeting(name) {
  const hour = new Date().getHours();
  const firstName = name.split(' ')[0];
  if (hour < 12) return `Good morning, ${firstName}`;
  if (hour < 17) return `Good afternoon, ${firstName}`;
  return `Good evening, ${firstName}`;
}

module.exports = router;
