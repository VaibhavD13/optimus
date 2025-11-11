const express = require('express');
const router = express.Router();

/**
 * OAuth Stubs
 * /api/v1/oauth/:provider
 * - For now we simulate a redirect to provider and a callback.
 * - Use these as placeholders to wire real OAuth flows later.
 */

const allowed = ['google', 'microsoft', 'apple'];

// Initiate OAuth (redirect to provider) - dev stub: redirect to callback immediately
router.get('/:provider', (req, res) => {
  const { provider } = req.params;
  if (!allowed.includes(provider)) return res.status(404).send('Not found');
  // In prod you'd redirect to provider's consent URL with client_id etc.
  // For dev we redirect back to a callback with a fake code
  const redirect = `/api/v1/oauth/${provider}/callback?code=dev_code_123&state=${encodeURIComponent(req.query.redirect || '/')}`;
  return res.redirect(302, redirect);
});

// Callback - exchange code for user info and create/login user (stub)
router.get('/:provider/callback', (req, res) => {
  const { provider } = req.params;
  const { code, state } = req.query;
  // Normally: exchange code for token, request profile, find/create local user
  // Here: return a JSON for dev and instruct the frontend to call /auth/login or /auth/register
  return res.json({
    provider,
    code,
    message: 'OAuth stub - integrate real provider here. Frontend should handle redirect and account linking.',
    state
  });
});

module.exports = router;