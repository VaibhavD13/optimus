const express = require('express');
const bcrypt = require('bcryptjs');
const { signAccessToken, signRefreshToken, REFRESH_SECRET } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// Register (Applicant or Employer)
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

// Login
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

// Refresh tokens
router.post('/refresh', async (req, res) => {
  try {
    const token = req.cookies?.refreshToken || req.body?.refreshToken;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    const jwt = require('jsonwebtoken');
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

// Logout (clear cookies)
router.post('/logout', (req, res) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  return res.json({ message: 'Logged out' });
});

module.exports = router;