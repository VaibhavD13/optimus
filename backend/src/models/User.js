const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  FirstName: { type: String, required: true },
  LastName: { type: String },
  Email: { type: String, required: true, unique: true, index: true },
  PasswordHash: { type: String, required: true },
  Role: { type: String, enum: ['Applicant','Employer','Admin'], required: true },
  CompanyId: { type: Schema.Types.ObjectId, ref: 'Company' },
  Profile: { type: Schema.Types.Mixed },
  LastLoginAt: { type: Date },

  // reset password
  ResetToken: { type: String },
  ResetExpires: { type: Date }
}, {
  timestamps: { createdAt: 'CreatedAt', updatedAt: 'UpdatedAt' }
});

module.exports = mongoose.model('User', UserSchema);