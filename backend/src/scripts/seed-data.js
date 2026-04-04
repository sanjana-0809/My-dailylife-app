// scripts/seed-data.js - Seed test data for development
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const { pool, query } = require('../config/database');
const bcrypt = require('bcrypt');
const { format, addDays } = require('date-fns');

const seed = async () => {
  try {
    console.log('Seeding test data...\n');

    // Create test user
    const passwordHash = await bcrypt.hash('password123', 10);
    const userResult = await query(
      `INSERT INTO users (email, password_hash, name)
       VALUES ($1, $2, $3)
       ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
       RETURNING id, email, name`,
      ['test@liferemind.app', passwordHash, 'Test User']
    );
    const user = userResult.rows[0];
    console.log(`✓ User created: ${user.email} (password: password123)`);

    const today = format(new Date(), 'yyyy-MM-dd');
    const tomorrow = format(addDays(new Date(), 1), 'yyyy-MM-dd');
    const nextWeek = format(addDays(new Date(), 7), 'yyyy-MM-dd');

    // Create sample reminders
    const reminders = [
      { title: 'Call Mom', desc: 'Birthday call', date: today, time: '19:00' },
      { title: 'Submit project report', desc: 'Final draft', date: tomorrow, time: '10:00' },
      { title: 'Dentist appointment', desc: 'Room 204', date: nextWeek, time: '14:30' },
      { title: 'Pay electricity bill', desc: null, date: tomorrow, time: '09:00' },
      { title: 'Buy groceries', desc: 'Milk, eggs, bread, vegetables', date: today, time: '18:00' },
    ];

    for (const r of reminders) {
      await query(
        `INSERT INTO reminders (user_id, title, description, due_date, due_time)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT DO NOTHING`,
        [user.id, r.title, r.desc, r.date, r.time]
      );
    }
    console.log(`✓ ${reminders.length} reminders created`);

    // Create sample habits
    const habits = [
      { title: 'Drink 8 glasses of water', freq: 'daily', time: '08:00' },
      { title: 'Exercise for 30 minutes', freq: 'daily', time: '07:00' },
      { title: 'Read for 20 minutes', freq: 'daily', time: '21:00' },
      { title: 'Weekly team standup prep', freq: 'weekly', time: '09:00', days: [1] },
      { title: 'Review monthly budget', freq: 'monthly', time: '10:00' },
    ];

    for (const h of habits) {
      await query(
        `INSERT INTO habits (user_id, title, frequency, due_time, days_of_week)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT DO NOTHING`,
        [user.id, h.title, h.freq, h.time, h.days || null]
      );
    }
    console.log(`✓ ${habits.length} habits created`);

    console.log('\n✅ Seed data complete!');
    console.log('   Login: test@liferemind.app / password123');
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
  } finally {
    await pool.end();
  }
};

seed();
