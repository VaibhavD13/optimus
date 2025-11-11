// backend/src/models/PasswordResetToken.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const PasswordResetTokenSchema = new Schema({
  UserId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  TokenHash: { type: String, required: true, index: true },
  ExpiresAt: { type: Date, required: true, index: { expires: 0 } }, // TTL index by ExpiresAt
  CreatedAt: { type: Date, default: Date.now }
});

// TTL will remove expired docs if 'ExpiresAt' is set and TTL monitor set on server.
module.exports = mongoose.model('PasswordResetToken', PasswordResetTokenSchema);