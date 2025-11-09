const mongoose = require('mongoose');
const { Schema } = mongoose;

const CompanySchema = new Schema({
  CompanyName: { type: String, required: true },
  Subdomain: { type: String, unique: true, sparse: true },
  Slug: { type: String, unique: true, sparse: true },
  BillingInfo: { type: Schema.Types.Mixed },
  Settings: { type: Schema.Types.Mixed }
}, {
  timestamps: { createdAt: 'CreatedAt', updatedAt: 'UpdatedAt' }
});

module.exports = mongoose.model('Company', CompanySchema);