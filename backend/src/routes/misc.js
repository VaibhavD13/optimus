const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  Name: String,
  Email: String,
  Message: String,
  CreatedAt: { type: Date, default: Date.now }
});
const Contact = mongoose.model('Contact', ContactSchema);

// POST /api/v1/contact
router.post('/contact', async (req, res) => {
  try {
    const { Name, Email, Message } = req.body;
    if (!Name || !Email || !Message) return res.status(400).json({ error: 'Missing fields' });
    const doc = new Contact({ Name, Email, Message });
    await doc.save();
    return res.json({ message: 'Thanks, we received your message' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;