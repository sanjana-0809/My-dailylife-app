// routes/habits.js - Habit CRUD + completion endpoints
const express = require('express');
const router = express.Router();
const Habit = require('../models/Habit');
const { authenticate } = require('../middleware/auth');
const { validateHabitInput } = require('../utils/validators');
const { asyncHandler } = require('../utils/helpers');

router.use(authenticate);

// POST /api/habits — Create a new habit
router.post('/', asyncHandler(async (req, res) => {
  const { title, frequency, due_time, days_of_week } = req.body;

  const errors = validateHabitInput({ title, frequency });
  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join(', ') });
  }

  const habit = await Habit.create({
    userId: req.user.id,
    title: title.trim(),
    frequency: frequency || 'daily',
    dueTime: due_time || '09:00',
    daysOfWeek: days_of_week || null,
  });

  res.status(201).json(habit);
}));

// GET /api/habits — List all habits
router.get('/', asyncHandler(async (req, res) => {
  const habits = await Habit.findByUser(req.user.id);
  res.json(habits);
}));

// GET /api/habits/:id — Single habit
router.get('/:id', asyncHandler(async (req, res) => {
  const habit = await Habit.findById(req.params.id, req.user.id);
  if (!habit) {
    return res.status(404).json({ error: 'Habit not found' });
  }
  res.json(habit);
}));

// PATCH /api/habits/:id/complete — Mark habit done for today
router.patch('/:id/complete', asyncHandler(async (req, res) => {
  const habit = await Habit.markComplete(req.params.id, req.user.id);
  if (!habit) {
    return res.status(404).json({ error: 'Habit not found' });
  }
  res.json(habit);
}));

// PATCH /api/habits/:id — Update habit
router.patch('/:id', asyncHandler(async (req, res) => {
  const updated = await Habit.update(req.params.id, req.user.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Habit not found or no changes made' });
  }
  res.json(updated);
}));

// DELETE /api/habits/:id — Delete habit
router.delete('/:id', asyncHandler(async (req, res) => {
  const deleted = await Habit.delete(req.params.id, req.user.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Habit not found' });
  }
  res.json({ success: true });
}));

module.exports = router;
