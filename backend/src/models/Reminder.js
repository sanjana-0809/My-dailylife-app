// models/Reminder.js - Reminder database queries
const { query } = require('../config/database');

const Reminder = {
  /**
   * Create a new reminder for a user.
   */
  async create({ userId, title, description, dueDate, dueTime, isRecurring, frequency }) {
    const result = await query(
      `INSERT INTO reminders (user_id, title, description, due_date, due_time, is_recurring, frequency)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [userId, title, description || null, dueDate, dueTime, isRecurring || false, frequency || null]
    );
    return result.rows[0];
  },

  /**
   * Get all reminders for a user, optionally filtered by status.
   */
  async findByUser(userId, { status, limit = 50, offset = 0 } = {}) {
    let sql = `SELECT * FROM reminders WHERE user_id = $1`;
    const params = [userId];

    if (status) {
      sql += ` AND status = $2`;
      params.push(status);
    }

    sql += ` ORDER BY due_date ASC, due_time ASC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await query(sql, params);
    return result.rows;
  },

  /**
   * Get a single reminder by ID (scoped to user).
   */
  async findById(id, userId) {
    const result = await query(
      `SELECT * FROM reminders WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );
    return result.rows[0] || null;
  },

  /**
   * Get today's active reminders for a user.
   */
  async findToday(userId) {
    const result = await query(
      `SELECT * FROM reminders 
       WHERE user_id = $1 AND due_date = CURRENT_DATE AND status = 'active'
       ORDER BY due_time ASC`,
      [userId]
    );
    return result.rows;
  },

  /**
   * Get all reminders that are due right now (for the scheduler).
   * Finds active reminders where due_date is today and due_time has passed,
   * but no notification has been sent yet (or was sent before today).
   */
  async findDueNow() {
    const result = await query(
      `SELECT r.*, u.phone_token, u.name as user_name
       FROM reminders r
       JOIN users u ON r.user_id = u.id
       WHERE r.due_date = CURRENT_DATE
         AND r.due_time <= CURRENT_TIME
         AND r.status = 'active'
         AND (r.last_notified IS NULL OR r.last_notified::date < CURRENT_DATE)`
    );
    return result.rows;
  },

  /**
   * Update a reminder's fields.
   */
  async update(id, userId, updates) {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    // Dynamically build SET clause from provided fields
    const allowedFields = ['title', 'description', 'due_date', 'due_time', 'is_recurring', 'frequency', 'status'];
    for (const [key, value] of Object.entries(updates)) {
      // Convert camelCase to snake_case for DB columns
      const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      if (allowedFields.includes(dbKey)) {
        fields.push(`${dbKey} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    }

    if (fields.length === 0) return null;

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id, userId);

    const result = await query(
      `UPDATE reminders SET ${fields.join(', ')} 
       WHERE id = $${paramIndex} AND user_id = $${paramIndex + 1}
       RETURNING *`,
      values
    );
    return result.rows[0] || null;
  },

  /**
   * Mark a reminder as completed.
   */
  async markComplete(id, userId) {
    const result = await query(
      `UPDATE reminders SET status = 'completed', updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND user_id = $2 RETURNING *`,
      [id, userId]
    );
    return result.rows[0] || null;
  },

  /**
   * Mark that a notification was sent for this reminder.
   */
  async markNotified(id) {
    await query(
      `UPDATE reminders SET last_notified = CURRENT_TIMESTAMP WHERE id = $1`,
      [id]
    );
  },

  /**
   * Delete a reminder.
   */
  async delete(id, userId) {
    const result = await query(
      `DELETE FROM reminders WHERE id = $1 AND user_id = $2 RETURNING id`,
      [id, userId]
    );
    return result.rowCount > 0;
  },

  /**
   * Search reminders by title.
   */
  async search(userId, searchTerm) {
    const result = await query(
      `SELECT * FROM reminders WHERE user_id = $1 AND title ILIKE $2 ORDER BY due_date ASC`,
      [userId, `%${searchTerm}%`]
    );
    return result.rows;
  },
};

module.exports = Reminder;
