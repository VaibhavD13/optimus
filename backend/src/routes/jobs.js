const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const tenantScope = require('../middleware/tenant');
const Job = require('../models/Job');

const router = express.Router();

// Public job listing (only published)
router.get('/public', async (req, res) => {
  const q = req.query.q || '';
  const page = Math.max(1, parseInt(req.query.page || '1'));
  const per = Math.min(50, parseInt(req.query.per || '10'));
  const filter = { IsPublished: true };
  if (q) filter.$text = { $search: q };
  const items = await Job.find(filter).skip((page - 1) * per).limit(per).lean();
  res.json({ items, page, per });
});

// Tenant-scoped job create (Employer)
router.post('/:companyId', authMiddleware, tenantScope, async (req, res) => {
  try {
    if (req.user.Role !== 'Employer' && req.user.Role !== 'Admin') return res.status(403).json({ error: 'Forbidden' });
    if (req.CompanyId.toString() !== req.params.companyId.toString()) return res.status(403).json({ error: 'Forbidden' });

    const doc = { ...req.body, CompanyId: req.CompanyId, EmployerId: req.user._id };
    const job = new Job(doc);
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update job (Employer)
router.put('/:id', authMiddleware, tenantScope, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Not found' });
    if (req.user.Role !== 'Admin' && job.EmployerId?.toString() !== req.user._id.toString()) return res.status(403).json({ error: 'Forbidden' });
    if (job.CompanyId.toString() !== req.CompanyId.toString()) return res.status(403).json({ error: 'Forbidden' });

    Object.assign(job, req.body);
    await job.save();
    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;