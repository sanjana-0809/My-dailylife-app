// config/database.js - PostgreSQL connection pool using node-postgres
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Connection pool settings for production resilience
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Log when pool connects successfully
pool.on('connect', () => {
  console.log('[DB] New client connected to PostgreSQL');
});

// Log pool errors (don't crash the server)
pool.on('error', (err) => {
  console.error('[DB] Unexpected error on idle client:', err.message);
});

/**
 * Execute a parameterized query against the database.
 * @param {string} text - SQL query string with $1, $2 placeholders
 * @param {Array} params - Parameter values
 * @returns {Promise<object>} Query result with rows
 */
const query = async (text, params) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV === 'development') {
      console.log('[DB Query]', { text: text.substring(0, 80), duration: `${duration}ms`, rows: result.rowCount });
    }
    return result;
  } catch (err) {
    console.error('[DB Query Error]', { text: text.substring(0, 80), error: err.message });
    throw err;
  }
};

module.exports = { pool, query };
