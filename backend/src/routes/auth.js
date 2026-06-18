// routes/auth.js - Authentication endpoints
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticate, generateToken, setAuthCookie, clearAuthCookie } = require('../middleware/auth');
const { isValidEmail, isValidPassword } = require('../utils/validators');
const { asyncHandler } = require('../utils/helpers');

// POST /api/auth/register — Create a new user account
router.post('/register', asyncHandler(async (req, res) => {
  const { email, password, name, phoneToken } = req.body;

  // Validate inputs
  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ error: 'Valid email is required' });
  }
  if (!password || !isValidPassword(password)) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }
  if (!name || name.trim().length === 0) {
    return res.status(400).json({ error: 'Name is required' });
  }

  // Check if email already exists
  const existing = await User.findByEmail(email);
  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists' });
  }

  // Create user
  const user = await User.create(email, password, name);

  // Store FCM token if provided during registration
  if (phoneToken) {
    await User.updatePhoneToken(user.id, phoneToken);
  }

  // Generate JWT — set as httpOnly cookie (web) and return it (native/Bearer)
  const token = generateToken(user);
  setAuthCookie(res, token);

  res.status(201).json({
    id: user.id,
    email: user.email,
    name: user.name,
    token,
  });
}));

// POST /api/auth/login — Login and receive JWT
router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // Find user by email
  const user = await User.findByEmail(email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  // Verify password
  const valid = await User.verifyPassword(password, user.password_hash);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = generateToken(user);
  setAuthCookie(res, token);

  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    token,
  });
}));

// POST /api/auth/logout — Clear the auth cookie
router.post('/logout', authenticate, (req, res) => {
  clearAuthCookie(res);
  res.json({ success: true, message: 'Logged out successfully' });
});

// PUT /api/auth/update-phone-token — Update FCM push token
router.put('/update-phone-token', authenticate, asyncHandler(async (req, res) => {
  const { phoneToken } = req.body;

  if (!phoneToken) {
    return res.status(400).json({ error: 'Phone token is required' });
  }

  await User.updatePhoneToken(req.user.id, phoneToken);
  res.json({ success: true });
}));

// GET /api/auth/me — Get current user profile
router.get('/me', authenticate, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
}));

module.exports = router;
