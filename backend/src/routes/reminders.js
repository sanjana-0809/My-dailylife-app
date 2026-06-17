// routes/reminders.js - Reminder CRUD + voice capture endpoint
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Reminder = require('../models/Reminder');
const { authenticate } = require('../middleware/auth');
const { transcribeAudio } = require('../services/voiceService');
const { parseReminderText } = require('../services/dateParser');
const { validateReminderInput } = require('../utils/validators');
const { asyncHandler } = require('../utils/helpers');

// Configure multer for audio file uploads (max 10MB)
const upload = multer({
  dest: path.join(__dirname, '../../uploads/'),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['audio/webm', 'audio/wav', 'audio/mp3', 'audio/mpeg', 'audio/ogg', 'audio/mp4', 'audio/m4a'];
    if (allowed.includes(file.mimetype) || file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed'));
    }
  },
});

// All routes below require authentication
router.use(authenticate);

// POST /api/reminders/voice — Record voice → transcribe → parse → create reminder
router.post('/voice', upload.single('audioFile'), asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Audio file is required' });
  }

  // Step 1: Transcribe audio to text
  const transcription = await transcribeAudio(req.file.path);

  if (!transcription) {
    return res.status(422).json({ error: 'Could not transcribe audio. Please try again.' });
  }

  // Step 2: Parse natural language into structured reminder data
  const parsed = parseReminderText(transcription);

  // Step 3: Save to database
  const reminder = await Reminder.create({
    userId: req.user.id,
    title: parsed.title,
    description: `Voice note: "${transcription}"`,
    dueDate: parsed.dueDate,
    dueTime: parsed.dueTime,
    isRecurring: parsed.isRecurring,
    frequency: parsed.frequency,
  });

  res.status(201).json({
    ...reminder,
    transcription,
    parsed,
  });
}));

// POST /api/reminders — Create a text-based reminder
router.post('/', asyncHandler(async (req, res) => {
  const { title, description, due_date, due_time, is_recurring, frequency, naturalText } = req.body;

  // If naturalText is provided, parse it automatically
  if (naturalText) {
    const parsed = parseReminderText(naturalText);
    const reminder = await Reminder.create({
      userId: req.user.id,
      title: parsed.title,
      description: description || null,
      dueDate: parsed.dueDate,
      dueTime: parsed.dueTime,
      isRecurring: parsed.isRecurring,
      frequency: parsed.frequency,
    });
    return res.status(201).json(reminder);
  }

  // Manual creation with explicit fields
  const errors = validateReminderInput({ title, due_date, due_time });
  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join(', ') });
  }

  const reminder = await Reminder.create({
    userId: req.user.id,
    title: title.trim(),
    description: description || null,
    dueDate: due_date,
    dueTime: due_time || '09:00',
    isRecurring: is_recurring || false,
    frequency: frequency || null,
  });

  res.status(201).json(reminder);
}));

// GET /api/reminders — List all reminders (paginated, filterable)
router.get('/', asyncHandler(async (req, res) => {
  const { status, limit = 50, offset = 0, search } = req.query;

  if (search) {
    const reminders = await Reminder.search(req.user.id, search);
    return res.json(reminders);
  }

  // Clamp pagination to safe bounds to prevent resource exhaustion
  const safeLimit = Math.min(Math.max(parseInt(limit) || 50, 1), 100);
  const safeOffset = Math.max(parseInt(offset) || 0, 0);

  const reminders = await Reminder.findByUser(req.user.id, {
    status,
    limit: safeLimit,
    offset: safeOffset,
  });
  res.json(reminders);
}));

// GET /api/reminders/today — Today's reminders
router.get('/today', asyncHandler(async (req, res) => {
  const reminders = await Reminder.findToday(req.user.id);
  res.json({
    today: new Date().toISOString().split('T')[0],
    count: reminders.length,
    reminders,
  });
}));

// GET /api/reminders/:id — Single reminder
router.get('/:id', asyncHandler(async (req, res) => {
  const reminder = await Reminder.findById(req.params.id, req.user.id);
  if (!reminder) {
    return res.status(404).json({ error: 'Reminder not found' });
  }
  res.json(reminder);
}));

// PATCH /api/reminders/:id — Update reminder
router.patch('/:id', asyncHandler(async (req, res) => {
  const updated = await Reminder.update(req.params.id, req.user.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Reminder not found or no changes made' });
  }
  res.json(updated);
}));

// PATCH /api/reminders/:id/mark-complete — Mark as done
router.patch('/:id/mark-complete', asyncHandler(async (req, res) => {
  const updated = await Reminder.markComplete(req.params.id, req.user.id);
  if (!updated) {
    return res.status(404).json({ error: 'Reminder not found' });
  }
  res.json(updated);
}));

// DELETE /api/reminders/:id — Delete reminder
router.delete('/:id', asyncHandler(async (req, res) => {
  const deleted = await Reminder.delete(req.params.id, req.user.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Reminder not found' });
  }
  res.json({ success: true });
}));

module.exports = router;
