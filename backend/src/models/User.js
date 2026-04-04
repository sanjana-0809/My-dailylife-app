// models/User.js - User database queries
const { query } = require('../config/database');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

const User = {
  /**
   * Create a new user with hashed password.
   * @param {string} email
   * @param {string} password - Plaintext (will be hashed)
   * @param {string} name
   * @returns {object} Created user (without password_hash)
   */
  async create(email, password, name) {
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const result = await query(
      `INSERT INTO users (email, password_hash, name) 
       VALUES ($1, $2, $3) 
       RETURNING id, email, name, created_at`,
      [email.toLowerCase().trim(), passwordHash, name.trim()]
    );
    return result.rows[0];
  },

  /**
   * Find user by email (includes password_hash for auth).
   */
  async findByEmail(email) {
    const result = await query(
      `SELECT id, email, password_hash, name, phone_token, created_at 
       FROM users WHERE email = $1`,
      [email.toLowerCase().trim()]
    );
    return result.rows[0] || null;
  },

  /**
   * Find user by ID (excludes password_hash).
   */
  async findById(id) {
    const result = await query(
      `SELECT id, email, name, phone_token, created_at FROM users WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  },

  /**
   * Compare plaintext password with stored hash.
   */
  async verifyPassword(plaintext, hash) {
    return bcrypt.compare(plaintext, hash);
  },

  /**
   * Update the user's FCM push notification token.
   */
  async updatePhoneToken(userId, token) {
    const result = await query(
      `UPDATE users SET phone_token = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2 RETURNING id, phone_token`,
      [token, userId]
    );
    return result.rows[0];
  },
};

module.exports = User;
