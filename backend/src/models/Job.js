const mongoose = require('mongoose');
const { Schema } = mongoose;

const SalaryRangeSchema = new Schema({
  Min: Number,
  Max: Number,
  Currency: String
}, { _id: false });

const JobSchema = new Schema({
  CompanyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
  EmployerId: { type: Schema.Types.ObjectId, ref: 'User' },
  JobTitle: { type: String, required: true, index: true },
  JobDescription: { type: String },
  Location: { type: String },
  EmploymentType: { type: String, enum: ['FullTime','PartTime','Contract','Internship'] },
  SalaryRange: SalaryRangeSchema,
  Skills: [String],
  IsPublished: { type: Boolean, default: false },
  PublishedAt: { type: Date },
  ClosesAt: { type: Date }
}, {
  timestamps: { createdAt: 'CreatedAt', updatedAt: 'UpdatedAt' }
});

JobSchema.index({ CompanyId: 1, JobTitle: 1 });

module.exports = mongoose.model('Job', JobSchema);