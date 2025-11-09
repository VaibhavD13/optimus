const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const tenantScope = require('../middleware/tenant');
const Application = require('../models/Application');
const Job = require('../models/Job');

const router = express.Router();

// Applicant applies to a job (public route or authenticated)
router.post('/apply/:jobId', authMiddleware, tenantScope, async (req, res) => {
  try {
    if (req.user.Role !== 'Applicant') return res.status(403).json({ error: 'Only applicants can apply' });
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    if (job.CompanyId.toString() !== req.CompanyId.toString()) return res.status(400).json({ error: 'Invalid CompanyId' });

    const existing = await Application.findOne({ JobId: job._id, ApplicantId: req.user._id });
    if (existing) return res.status(400).json({ error: 'Already applied' });

    const appDoc = new Application({
      JobId: job._id,
      ApplicantId: req.user._id,
      CompanyId: job.CompanyId,
      CoverLetter: req.body.CoverLetter,
      ResumeUrl: req.body.ResumeUrl
    });
    await appDoc.save();
    res.status(201).json(appDoc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Employer list applications for company (tenant)
router.get('/company/:companyId', authMiddleware, tenantScope, async (req, res) => {
  try {
    if (req.CompanyId.toString() !== req.params.companyId.toString()) return res.status(403).json({ error: 'Forbidden' });
    if (!['Employer','Admin'].includes(req.user.Role)) return res.status(403).json({ error: 'Forbidden' });
    const items = await Application.find({ CompanyId: req.CompanyId }).populate('JobId ApplicantId', 'JobTitle FirstName LastName Email').lean();
    res.json({ items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;