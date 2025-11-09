const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'change_refresh_secret';

function signAccessToken(user) {
  const payload = { sub: user._id, role: user.Role, CompanyId: user.CompanyId };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES || '15m' });
  return token;
}

function signRefreshToken(user) {
  const payload = { sub: user._id };
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: process.env.REFRESH_EXPIRES || '7d' });
}

async function authMiddleware(req, res, next) {
  try {
    const token = req.cookies?.accessToken || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.sub).select('-PasswordHash').lean();
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

module.exports = { authMiddleware, signAccessToken, signRefreshToken, JWT_SECRET, REFRESH_SECRET };