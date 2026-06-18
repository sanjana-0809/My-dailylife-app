// services/dateParser.js - Natural language date parsing
const chrono = require('chrono-node');
const { format, addDays, addWeeks, addMonths } = require('date-fns');

/**
 * Parse a natural language string and extract date, time, title, and recurrence.
 *
 * Examples:
 *   "Remind me to call mom on March 15th at 7 PM"
 *     → { title: "call mom", dueDate: "2026-03-15", dueTime: "19:00", isRecurring: false }
 *
 *   "Drink water every day at 8 AM"
 *     → { title: "Drink water", dueDate: today, dueTime: "08:00", isRecurring: true, frequency: "daily" }
 *
 *   "Submit report in 3 days"
 *     → { title: "Submit report", dueDate: today+3, dueTime: "09:00", isRecurring: false }
 *
 * @param {string} text - Natural language input
 * @returns {object} Parsed reminder data
 */
/**
 * Normalize colloquial time-of-day phrases into something chrono understands.
 *   "evening 8" / "8 in the evening" → "8 PM"
 *   "morning 7" / "7 in the morning" → "7 AM"
 *   "afternoon 3", "night 9", "tonight 8" → PM
 */
const normalizeTimePhrases = (text) => {
  let t = text;

  // "<tod> <hour>"  e.g. "evening 8", "morning 7", "afternoon 3"
  t = t.replace(/\b(morning)\s+(\d{1,2})(:\d{2})?\b/gi, (_, _tod, h, min) => `${h}${min || ''} AM`);
  t = t.replace(/\b(afternoon|evening|night|tonight)\s+(\d{1,2})(:\d{2})?\b/gi, (_, _tod, h, min) => `${h}${min || ''} PM`);

  // "<hour> [in the] <tod>"  e.g. "8 in the evening", "7 in the morning", "8 evening"
  t = t.replace(/\b(\d{1,2})(:\d{2})?\s+(?:in the\s+)?(morning)\b/gi, (_, h, min) => `${h}${min || ''} AM`);
  t = t.replace(/\b(\d{1,2})(:\d{2})?\s+(?:in the\s+)?(afternoon|evening|night)\b/gi, (_, h, min) => `${h}${min || ''} PM`);

  return t;
};

const parseReminderText = (text) => {
  if (!text || !text.trim()) {
    throw new Error('Empty text — nothing to parse');
  }

  const original = text.trim();
  const input = normalizeTimePhrases(original);

  // --- Step 1: Detect recurrence keywords ---
  let isRecurring = false;
  let frequency = null;
  const recurringPatterns = [
    { regex: /\bevery\s*day\b/i, freq: 'daily' },
    { regex: /\bdaily\b/i, freq: 'daily' },
    { regex: /\bevery\s*week\b/i, freq: 'weekly' },
    { regex: /\bweekly\b/i, freq: 'weekly' },
    { regex: /\bevery\s*(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i, freq: 'weekly' },
    { regex: /\bevery\s*month\b/i, freq: 'monthly' },
    { regex: /\bmonthly\b/i, freq: 'monthly' },
  ];

  for (const pattern of recurringPatterns) {
    if (pattern.regex.test(input)) {
      isRecurring = true;
      frequency = pattern.freq;
      break;
    }
  }

  // --- Step 2: Parse date/time with chrono-node ---
  const parsed = chrono.parse(input, new Date(), { forwardDate: true });

  let dueDate, dueTime;

  if (parsed.length > 0) {
    const result = parsed[0];
    const startDate = result.start.date();

    dueDate = format(startDate, 'yyyy-MM-dd');

    // If time was explicitly mentioned, use it; otherwise default to 9:00 AM
    if (result.start.isCertain('hour')) {
      dueTime = format(startDate, 'HH:mm');
    } else {
      dueTime = '09:00';
    }
  } else {
    // No date found — default to tomorrow at 9 AM
    const tomorrow = addDays(new Date(), 1);
    dueDate = format(tomorrow, 'yyyy-MM-dd');
    dueTime = '09:00';
  }

  // --- Step 3: Extract the reminder title ---
  // Remove common prefixes and the date/time portion to get the core task
  let title = input
    .replace(/^(remind\s+me\s+to|remind\s+me|remember\s+to|don't\s+forget\s+to|note\s+to\s+self)\s*/i, '')
    .replace(/\b(on|at|by|before|after|next|this|every|in)\s+\d.*$/i, '')
    .replace(/\b(on|at)\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b.*/i, '')
    .replace(/\b(every\s*day|daily|weekly|monthly|every\s*week|every\s*month)\b/gi, '')
    .replace(/\b(every\s*(monday|tuesday|wednesday|thursday|friday|saturday|sunday))\b/gi, '')
    .replace(/\b(today|tomorrow|tonight)\b/gi, '')
    .replace(/\b(in\s+\d+\s*(day|days|week|weeks|month|months|hour|hours|minute|minutes))\b/gi, '')
    .replace(/\b(at\s+)?(morning|afternoon|evening|night)\b/gi, '')
    .replace(/\b\d{1,2}(:\d{2})?\s*(am|pm)\b/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim();

  // If title extraction removed everything, use the original text
  if (!title || title.length < 2) {
    title = original;
  }

  // Capitalize first letter
  title = title.charAt(0).toUpperCase() + title.slice(1);

  return {
    title,
    dueDate,
    dueTime,
    isRecurring,
    frequency,
    originalText: original,
  };
};

module.exports = { parseReminderText };
