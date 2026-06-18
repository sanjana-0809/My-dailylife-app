// index.js - Express app entry point
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');

// Import middleware
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/auth');
const reminderRoutes = require('./routes/reminders');
const habitRoutes = require('./routes/habits');
const notificationRoutes = require('./routes/notifications');
const dashboardRoutes = require('./routes/dashboard');

// Import services
const { initializeFirebase } = require('./config/firebase');
const { initializeDatabase } = require('./models/db');
const { startScheduler } = require('./services/schedulerService');

const app = express();
const PORT = process.env.PORT || 5000;

// Behind Render's reverse proxy: trust the first proxy hop so req.ip reflects
// the real client (X-Forwarded-For). Required for correct per-IP rate limiting.
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// ─── Fail fast on missing/insecure critical config ───
const INSECURE_JWT_DEFAULT = 'dev_jwt_secret_change_in_production_abc123';
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.error('[Config] JWT_SECRET is missing or too short (need >= 32 chars). Refusing to start.');
  process.exit(1);
}
if (process.env.NODE_ENV === 'production') {
  if (process.env.JWT_SECRET === INSECURE_JWT_DEFAULT) {
    console.error('[Config] JWT_SECRET is still the development default. Refusing to start in production.');
    process.exit(1);
  }
  if (!process.env.FRONTEND_URL) {
    console.error('[Config] FRONTEND_URL must be set in production (required for CORS). Refusing to start.');
    process.exit(1);
  }
}

// ─── Security & Parsing Middleware ───
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL
    : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'],
  credentials: true,
}));
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));
app.use(cookieParser());
app.use(logger);

// Health check — defined before the limiter so Render's frequent uptime probes
// are never rate-limited (a 429 here makes Render mark the instance failed).
app.get('/api/health', (req, res) => {
  const key = process.env.GROQ_API_KEY;
  // Safe boolean only — never exposes the key itself
  const voiceEnabled = !!key && !key.startsWith('gsk_your');
  res.json({ status: 'ok', voiceEnabled, timestamp: new Date().toISOString() });
});

// Rate limiting — 300 requests per 15 minutes per IP (health check exempt)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.originalUrl.split('?')[0] === '/api/health',
  message: { error: 'Too many requests. Please try again later.' },
});
app.use('/api/', limiter);

// Stricter limiter for auth endpoints to throttle brute-force attempts
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  skipSuccessfulRequests: true,
  message: { error: 'Too many login attempts. Please try again later.' },
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Ensure uploads directory exists
const fs = require('fs');
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ─── API Routes ───
app.use('/api/auth', authRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/dashboard', dashboardRoutes);

// ─── Serve React Frontend in Production ───
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../../frontend/build');
  app.use(express.static(frontendPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

// ─── Error Handler (must be last middleware) ───
app.use(errorHandler);

// ─── Start Server ───
const startServer = async () => {
  try {
    // 1. Initialize database tables
    await initializeDatabase();
    console.log('[Server] Database initialized ✓');

    // 2. Initialize Firebase for push notifications
    initializeFirebase();

    // 3. Start background scheduler (cron jobs)
    startScheduler();

    // 4. Start Express server
    app.listen(PORT, () => {
      console.log(`\n🚀 LifeRemind API running on http://localhost:${PORT}`);
      console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`   Health check: http://localhost:${PORT}/api/health\n`);
    });
  } catch (err) {
    console.error('[Server] Failed to start:', err.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;
