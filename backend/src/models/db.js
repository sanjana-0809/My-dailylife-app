// models/db.js - Database table creation & initialization
const { query } = require('../config/database');

/**
 * Create all database tables if they don't exist.
 * Safe to run multiple times (uses IF NOT EXISTS).
 */
const initializeDatabase = async () => {
  console.log('[DB Init] Creating tables...');

  // Users table - stores account info and FCM push token
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      phone_token TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log('[DB Init] ✓ users table');

  // Reminders table - individual reminder items with scheduling info
  await query(`
    CREATE TABLE IF NOT EXISTS reminders (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      description TEXT,
      due_date DATE NOT NULL,
      due_time TIME NOT NULL,
      is_recurring BOOLEAN DEFAULT false,
      frequency VARCHAR(50),
      status VARCHAR(50) DEFAULT 'active',
      last_notified TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log('[DB Init] ✓ reminders table');

  // Habits table - recurring habits with streak tracking
  await query(`
    CREATE TABLE IF NOT EXISTS habits (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      frequency VARCHAR(50) NOT NULL DEFAULT 'daily',
      due_time TIME NOT NULL DEFAULT '09:00',
      days_of_week INTEGER[],
      completed_today BOOLEAN DEFAULT false,
      streak_count INTEGER DEFAULT 0,
      last_completed_date DATE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log('[DB Init] ✓ habits table');

  // Notification logs - track delivery history for debugging
  await query(`
    CREATE TABLE IF NOT EXISTS notification_logs (
      id SERIAL PRIMARY KEY,
      reminder_id INTEGER REFERENCES reminders(id) ON DELETE SET NULL,
      habit_id INTEGER REFERENCES habits(id) ON DELETE SET NULL,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      delivery_status VARCHAR(50) DEFAULT 'pending',
      error_message TEXT
    );
  `);
  console.log('[DB Init] ✓ notification_logs table');

  // Create indexes for frequently-queried columns
  await query(`CREATE INDEX IF NOT EXISTS idx_reminders_user ON reminders(user_id);`);
  await query(`CREATE INDEX IF NOT EXISTS idx_reminders_due ON reminders(due_date, due_time);`);
  await query(`CREATE INDEX IF NOT EXISTS idx_reminders_status ON reminders(status);`);
  await query(`CREATE INDEX IF NOT EXISTS idx_habits_user ON habits(user_id);`);
  await query(`CREATE INDEX IF NOT EXISTS idx_notif_logs_user ON notification_logs(user_id);`);
  console.log('[DB Init] ✓ indexes created');

  console.log('[DB Init] All tables initialized successfully!');
};

module.exports = { initializeDatabase };
