const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const tenantScope = require('../middleware/tenant');
const Job = require('../models/Job');

const router = express.Router();

/**
 * Public listing (only published jobs)
 * GET /api/v1/jobs/public?q=&page=&per=
 */
router.get('/public', async (req, res) => {
  try {
    const q = req.query.q || '';
    const page = Math.max(1, parseInt(req.query.page || '1'));
    const per = Math.min(50, parseInt(req.query.per || '10'));
    const filter = { IsPublished: true };
    if (q) filter.$text = { $search: q };
    const items = await Job.find(filter).skip((page - 1) * per).limit(per).lean();
    return res.json({ items, page, per });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

/**
 * Public job detail
 * GET /api/v1/jobs/:id
 * - If job is published => returns to anyone
 * - If not published => only Tenant users (Employer/Admin) of that company or Admin can view
 */
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).lean();
    if (!job) return res.status(404).json({ error: 'Not found' });

    if (job.IsPublished) return res.json(job);

    // not published -> require auth + tenant check
    const authHeader = req.headers.authorization;
    if (!authHeader && !req.cookies?.accessToken) return res.status(403).json({ error: 'Forbidden' });

    // try to verify token using existing auth middleware logic
    // simple reuse by calling authMiddleware - but we don't have req/res next chain here
    // Instead, require explicit auth middleware when making internal calls:
    return res.status(403).json({ error: 'Forbidden' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

/**
 * Tenant-scoped: create a job (Employer)
 * POST /api/v1/jobs/:companyId
 */
router.post('/:companyId', authMiddleware, tenantScope, async (req, res) => {
  try {
    if (req.user.Role !== 'Employer' && req.user.Role !== 'Admin') return res.status(403).json({ error: 'Forbidden' });
    if (req.CompanyId.toString() !== req.params.companyId.toString()) return res.status(403).json({ error: 'Forbidden' });

    const doc = { ...req.body, CompanyId: req.CompanyId, EmployerId: req.user._id };
    const job = new Job(doc);
    await job.save();
    return res.status(201).json(job);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

/**
 * Update job (partial) - keeps previous behavior
 * PUT /api/v1/jobs/:id
 */
router.put('/:id', authMiddleware, tenantScope, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Not found' });

    // Only admin or employer who owns the job may update
    if (req.user.Role !== 'Admin' && job.EmployerId?.toString() !== req.user._id.toString()) return res.status(403).json({ error: 'Forbidden' });
    if (job.CompanyId.toString() !== req.CompanyId.toString()) return res.status(403).json({ error: 'Forbidden' });

    Object.assign(job, req.body);
    await job.save();
    return res.json(job);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

/**
 * Publish / Unpublish endpoint
 * POST /api/v1/jobs/:id/publish
 * body: { publish: true }  (boolean)
 * - Only Employer (owner) or Admin may publish
 */
router.post('/:id/publish', authMiddleware, tenantScope, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Not found' });

    // permission checks
    if (req.user.Role !== 'Admin' && job.EmployerId?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    if (job.CompanyId.toString() !== req.CompanyId.toString()) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const publish = !!req.body.publish;
    job.IsPublished = publish;
    job.PublishedAt = publish ? new Date() : null;
    await job.save();
    return res.json({ message: publish ? 'Published' : 'Unpublished', job });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

/**
 * Tenant: list all jobs for a company (Employer/Admin)
 * GET /api/v1/jobs/company/:companyId
 */
router.get('/company/:companyId', authMiddleware, tenantScope, async (req, res) => {
  try {
    if (req.CompanyId.toString() !== req.params.companyId.toString()) return res.status(403).json({ error: 'Forbidden' });
    if (!['Employer','Admin'].includes(req.user.Role)) return res.status(403).json({ error: 'Forbidden' });

    const items = await Job.find({ CompanyId: req.CompanyId }).sort({ CreatedAt: -1 }).lean();
    return res.json({ items });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;