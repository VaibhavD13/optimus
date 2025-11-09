// Ensures CompanyId is available for tenant-scoped routes.
// Prefer user.CompanyId, fallback to header x-company-id (admin use)
function tenantScope(req, res, next) {
  const fromUser = req.user && req.user.CompanyId;
  const fromHeader = req.headers['x-company-id'];
  req.CompanyId = fromUser || fromHeader;
  if (!req.CompanyId && req.user?.Role !== 'Admin') {
    return res.status(400).json({ error: 'CompanyId required' });
  }
  next();
}

module.exports = tenantScope;