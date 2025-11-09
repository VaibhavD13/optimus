const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// Get my profile
router.get('/me', authMiddleware, async (req, res) => {
  return res.json({ user: req.user });
});

// Update profile (partial)
router.put('/me', authMiddleware, async (req, res) => {
  try {
    const updates = req.body;
    // Prevent role changes here; admins only in separate admin APIs
    delete updates.Role;
    delete updates.PasswordHash;
    const updated = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-PasswordHash');
    return res.json({ user: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;