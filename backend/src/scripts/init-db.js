// scripts/init-db.js - Standalone database initialization
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const { initializeDatabase } = require('../models/db');
const { pool } = require('../config/database');

(async () => {
  try {
    console.log('Initializing LifeRemind database...');
    await initializeDatabase();
    console.log('\n✅ Database initialization complete!');
  } catch (err) {
    console.error('❌ Database initialization failed:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
})();
