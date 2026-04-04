// models/Habit.js - Habit database queries
const { query } = require('../config/database');

const Habit = {
  /**
   * Create a new habit for a user.
   */
  async create({ userId, title, frequency, dueTime, daysOfWeek }) {
    const result = await query(
      `INSERT INTO habits (user_id, title, frequency, due_time, days_of_week)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [userId, title, frequency || 'daily', dueTime || '09:00', daysOfWeek || null]
    );
    return result.rows[0];
  },

  /**
   * Get all habits for a user.
   */
  async findByUser(userId) {
    const result = await query(
      `SELECT * FROM habits WHERE user_id = $1 ORDER BY due_time ASC`,
      [userId]
    );
    return result.rows;
  },

  /**
   * Get a single habit by ID (scoped to user).
   */
  async findById(id, userId) {
    const result = await query(
      `SELECT * FROM habits WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );
    return result.rows[0] || null;
  },

  /**
   * Get habits that are due right now (for the scheduler).
   * Checks frequency against the current day.
   */
  async findDueNow() {
    const dayOfWeek = new Date().getDay(); // 0=Sun, 1=Mon, ...6=Sat
    const result = await query(
      `SELECT h.*, u.phone_token, u.name as user_name
       FROM habits h
       JOIN users u ON h.user_id = u.id
       WHERE h.completed_today = false
         AND h.due_time <= CURRENT_TIME
         AND (
           h.frequency = 'daily'
           OR (h.frequency = 'weekly' AND $1 = ANY(h.days_of_week))
           OR (h.frequency = 'monthly' AND EXTRACT(DAY FROM CURRENT_DATE) = 1)
         )`,
      [dayOfWeek]
    );
    return result.rows;
  },

  /**
   * Mark a habit as completed for today.
   * Updates streak: if last completed was yesterday, increment; otherwise reset to 1.
   */
  async markComplete(id, userId) {
    const habit = await this.findById(id, userId);
    if (!habit) return null;

    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    // Calculate new streak
    let newStreak = 1;
    if (habit.last_completed_date) {
      const lastDate = new Date(habit.last_completed_date).toISOString().split('T')[0];
      if (lastDate === yesterday) {
        newStreak = habit.streak_count + 1; // Consecutive day → increment
      } else if (lastDate === today) {
        newStreak = habit.streak_count; // Already completed today
      }
    }

    const result = await query(
      `UPDATE habits 
       SET completed_today = true, streak_count = $1, last_completed_date = CURRENT_DATE
       WHERE id = $2 AND user_id = $3
       RETURNING *`,
      [newStreak, id, userId]
    );
    return result.rows[0];
  },

  /**
   * Reset all habits' completed_today flag (run at midnight).
   */
  async resetDaily() {
    await query(`UPDATE habits SET completed_today = false`);
    console.log('[Habits] Daily reset complete');
  },

  /**
   * Update a habit's fields.
   */
  async update(id, userId, updates) {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    const allowedFields = ['title', 'frequency', 'due_time', 'days_of_week'];
    for (const [key, value] of Object.entries(updates)) {
      const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      if (allowedFields.includes(dbKey)) {
        fields.push(`${dbKey} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    }

    if (fields.length === 0) return null;

    values.push(id, userId);
    const result = await query(
      `UPDATE habits SET ${fields.join(', ')} 
       WHERE id = $${paramIndex} AND user_id = $${paramIndex + 1}
       RETURNING *`,
      values
    );
    return result.rows[0] || null;
  },

  /**
   * Delete a habit.
   */
  async delete(id, userId) {
    const result = await query(
      `DELETE FROM habits WHERE id = $1 AND user_id = $2 RETURNING id`,
      [id, userId]
    );
    return result.rowCount > 0;
  },
};

module.exports = Habit;
