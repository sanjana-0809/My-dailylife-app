// middleware/auth.js - JWT authentication middleware
const jwt = require('jsonwebtoken');
require('dotenv').config();

const COOKIE_NAME = 'liferemind_token';
const TOKEN_TTL_DAYS = 7;

/**
 * Verify JWT token from the httpOnly cookie (preferred) or the
 * Authorization header (for non-browser API clients).
 * Attaches decoded user payload to req.user.
 */
const authenticate = (req, res, next) => {
  let token = req.cookies?.[COOKIE_NAME];

  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
  }

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, name }
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired. Please login again.' });
    }
    return res.status(401).json({ error: 'Invalid token.' });
  }
};

/**
 * Generate a JWT token for a user.
 * @param {object} user - User object with id, email, name
 * @returns {string} JWT token (expires in 7 days)
 */
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: `${TOKEN_TTL_DAYS}d` }
  );
};

/**
 * Set the auth token as an httpOnly cookie on the response.
 * httpOnly prevents JS/XSS from reading it; secure+sameSite limit exposure.
 */
const setAuthCookie = (res, token) => {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000,
    path: '/',
  });
};

/**
 * Clear the auth cookie (logout).
 */
const clearAuthCookie = (res) => {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
};

module.exports = { authenticate, generateToken, setAuthCookie, clearAuthCookie, COOKIE_NAME };
