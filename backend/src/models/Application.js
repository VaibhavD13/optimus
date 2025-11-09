const mongoose = require('mongoose');
const { Schema } = mongoose;

const NoteSchema = new Schema({
  AuthorId: Schema.Types.ObjectId,
  Text: String,
  CreatedAt: { type: Date, default: Date.now }
}, { _id: false });

const ApplicationSchema = new Schema({
  JobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true, index: true },
  ApplicantId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  CompanyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  CoverLetter: { type: String },
  ResumeUrl: { type: String },
  Status: { type: String, enum: ['Submitted','Viewed','Interview','Offered','Rejected'], default: 'Submitted' },
  Notes: [NoteSchema]
}, {
  timestamps: { createdAt: 'CreatedAt', updatedAt: 'UpdatedAt' }
});

ApplicationSchema.index({ JobId: 1, ApplicantId: 1 }, { unique: false });

module.exports = mongoose.model('Application', ApplicationSchema);