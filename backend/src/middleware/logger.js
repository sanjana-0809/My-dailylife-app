// middleware/logger.js - Simple request logger
const morgan = require('morgan');

// Use 'dev' format in development, 'combined' in production for access logs
const logger = process.env.NODE_ENV === 'production'
  ? morgan('combined')
  : morgan('dev');

module.exports = logger;
