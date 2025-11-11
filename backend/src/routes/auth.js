// backend/src/routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const passport = require('../passport'); // passport strategies (google, microsoft, apple)
const User = require('../models/User');
const PasswordResetToken = require('../models/PasswordResetToken');
const { sendResetEmail } = require('../utils/mailer');

// single import of auth helpers (only once)
const { authMiddleware, signAccessToken, signRefreshToken, REFRESH_SECRET } = require('../middleware/auth');

const router = express.Router();
const RESET_TOKEN_EXPIRE_HOURS = 1; // token expiry
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

/**
 * Register (Applicant or Employer)
 */
router.post('/register', async (req, res) => {
  try {
    const { FirstName, LastName, Email, Password, Role, CompanyId } = req.body;
    if (!FirstName || !Email || !Password || !Role) return res.status(400).json({ error: 'Missing fields' });

    const existing = await User.findOne({ Email });
    if (existing) return res.status(400).json({ error: 'Email already in use' });

    const hash = await bcrypt.hash(Password, 10);
    const user = new User({ FirstName, LastName, Email, PasswordHash: hash, Role, CompanyId: CompanyId || null });
    await user.save();

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    res.cookie('accessToken', accessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' });

    return res.status(201).json({ message: 'Registered', user: { id: user._id, Email: user.Email, Role: user.Role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * Login
 */
router.post('/login', async (req, res) => {
  try {
    const { Email, Password } = req.body;
    if (!Email || !Password) return res.status(400).json({ error: 'Missing fields' });

    const user = await User.findOne({ Email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(Password, user.PasswordHash);
    if (!ok) return res.status(400).json({ error: 'Invalid credentials' });

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    user.LastLoginAt = new Date();
    await user.save();

    res.cookie('accessToken', accessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' });

    return res.json({ message: 'Logged in', user: { id: user._id, Email: user.Email, Role: user.Role, CompanyId: user.CompanyId } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * Refresh tokens
 */
router.post('/refresh', async (req, res) => {
  try {
    const token = req.cookies?.refreshToken || req.body?.refreshToken;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    const payload = jwt.verify(token, REFRESH_SECRET);
    const user = await User.findById(payload.sub);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    res.cookie('accessToken', accessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' });

    return res.json({ message: 'Refreshed' });
  } catch (err) {
    console.error(err);
    return res.status(401).json({ error: 'Unauthorized' });
  }
});

/**
 * Logout (clear cookies)
 */
router.post('/logout', (req, res) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  return res.json({ message: 'Logged out' });
});

/**
 * Forgot password
 * POST /auth/forgot
 * body: { Email }
 */
router.post('/forgot', async (req, res) => {
  try {
    const { Email } = req.body;
    if (!Email) return res.status(400).json({ error: 'Email required' });

    const user = await User.findOne({ Email });
    if (!user) {
      // Do not reveal whether account exists — respond with success
      return res.json({ message: 'If an account exists, reset instructions were sent.' });
    }

    // create token
    const token = crypto.randomBytes(32).toString('hex'); // raw token for user
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const expiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRE_HOURS * 60 * 60 * 1000);

    // remove previous tokens for user
    await PasswordResetToken.deleteMany({ UserId: user._id });

    // store hashed token
    await PasswordResetToken.create({ UserId: user._id, TokenHash: tokenHash, ExpiresAt: expiresAt });

    // send email containing frontend link with token (raw token)
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetUrl = `${frontendUrl}/reset-password?token=${token}&id=${user._id}`;
    try {
      await sendResetEmail(user.Email, resetUrl);
    } catch (mailErr) {
      console.error('Failed sending reset email', mailErr);
      // If sending mail fails, still respond success to avoid user enumeration; log for debug.
    }

    return res.json({ message: 'If an account exists, reset instructions were sent.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

/**
 * Reset password
 * POST /auth/reset
 * body: { token, userId, password }
 */
router.post('/reset', async (req, res) => {
  try {
    const { token, userId, password } = req.body;
    if (!token || !userId || !password) return res.status(400).json({ error: 'Missing fields' });

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const record = await PasswordResetToken.findOne({ UserId: userId, TokenHash: tokenHash });
    if (!record) return res.status(400).json({ error: 'Invalid or expired token' });
    if (new Date(record.ExpiresAt) < new Date()) {
      await PasswordResetToken.deleteMany({ UserId: userId });
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ error: 'Invalid user' });

    const hash = await bcrypt.hash(password, 10);
    user.PasswordHash = hash;
    await user.save();

    // remove tokens for user
    await PasswordResetToken.deleteMany({ UserId: userId });

    return res.json({ message: 'Password reset successful' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

/**
 * OAuth start routes: GET /api/v1/auth/oauth/:provider
 */
router.get('/oauth/:provider', (req, res, next) => {
  const provider = req.params.provider;
  if (provider === 'google') {
    return passport.authenticate('google', { scope: ['profile', 'email'], session: false })(req, res, next);
  }
  if (provider === 'microsoft') {
    return passport.authenticate('azuread-openidconnect', { session: false })(req, res, next);
  }
  if (provider === 'apple') {
    return passport.authenticate('apple', { scope: ['name', 'email'], session: false })(req, res, next);
  }
  return res.status(400).json({ error: 'Unknown provider' });
});

/**
 * OAuth callback handlers
 */

// Google callback (GET)
router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${FRONTEND_URL}/?oauth=fail` }),
  async (req, res) => {
    try {
      const user = req.user;
      const accessToken = signAccessToken(user);
      const refreshToken = signRefreshToken(user);
      // set cookies then redirect to frontend
      res.cookie('accessToken', accessToken, { httpOnly: true, sameSite: 'lax' });
      res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'lax' });
      return res.redirect(`${FRONTEND_URL}/?oauth=success`);
    } catch (err) {
      console.error(err);
      return res.redirect(`${FRONTEND_URL}/?oauth=error`);
    }
  }
);

// Microsoft callback (POST)
router.post('/microsoft/callback',
  passport.authenticate('azuread-openidconnect', { session: false, failureRedirect: `${FRONTEND_URL}/?oauth=fail` }),
  async (req, res) => {
    try {
      const user = req.user;
      const accessToken = signAccessToken(user);
      const refreshToken = signRefreshToken(user);
      res.cookie('accessToken', accessToken, { httpOnly: true, sameSite: 'lax' });
      res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'lax' });
      return res.redirect(`${FRONTEND_URL}/?oauth=success`);
    } catch (err) {
      console.error(err);
      return res.redirect(`${FRONTEND_URL}/?oauth=error`);
    }
  }
);

// Apple callback (POST)
router.post('/apple/callback',
  passport.authenticate('apple', { session: false, failureRedirect: `${FRONTEND_URL}/?oauth=fail` }),
  async (req, res) => {
    try {
      const user = req.user;
      const accessToken = signAccessToken(user);
      const refreshToken = signRefreshToken(user);
      res.cookie('accessToken', accessToken, { httpOnly: true, sameSite: 'lax' });
      res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'lax' });
      return res.redirect(`${FRONTEND_URL}/?oauth=success`);
    } catch (err) {
      console.error(err);
      return res.redirect(`${FRONTEND_URL}/?oauth=error`);
    }
  }
);

module.exports = router;