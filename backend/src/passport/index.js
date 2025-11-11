// backend/src/passport/index.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { OIDCStrategy: MicrosoftStrategy } = require('passport-azure-ad'); // using OIDC for MS
const AppleStrategy = require('passport-apple').Strategy; // may require passport-apple package
const User = require('../models/User');
const crypto = require('crypto');
const fs = require('fs');

const {
  GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET,
  MICROSOFT_CLIENT_ID, MICROSOFT_CLIENT_SECRET, MICROSOFT_TENANT_ID,
  APPLE_CLIENT_ID, APPLE_TEAM_ID, APPLE_KEY_ID, APPLE_PRIVATE_KEY_PATH,
  OAUTH_CALLBACK_BASE
} = process.env;

function ensureEmailFromProfile(profile) {
  if (profile.emails && profile.emails.length) return profile.emails[0].value;
  if (profile._json && profile._json.email) return profile._json.email;
  return null;
}

/**
 * Shared find-or-create helper
 * provider: 'google'|'microsoft'|'apple'
 * profile: passport profile
 */
async function findOrCreateOAuthUser(provider, profile) {
  const email = ensureEmailFromProfile(profile);
  // Use provider-specific id stored in ProfileId subfield, but our user schema only has Email and CompanyId etc.
  // We'll look up by email first, else create user.
  let user = null;
  if (email) user = await User.findOne({ Email: email });
  if (!user) {
    // Create a minimal user - force Role Applicant by default (change as needed)
    const randomPass = crypto.randomBytes(16).toString('hex');
    const bcrypt = require('bcryptjs');
    const hash = await bcrypt.hash(randomPass, 10);
    user = new User({
      FirstName: profile.name?.givenName || profile.displayName || 'User',
      LastName: profile.name?.familyName || '',
      Email: email || `oauth-${provider}-${profile.id}@noemail.local`,
      PasswordHash: hash,
      Role: 'Applicant'
    });
    await user.save();
  }
  return user;
}

// GOOGLE
if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: `${OAUTH_CALLBACK_BASE}/google/callback`,
    passReqToCallback: true
  }, async (req, accessToken, refreshToken, profile, done) => {
    try {
      const user = await findOrCreateOAuthUser('google', profile);
      done(null, user);
    } catch (err) {
      done(err);
    }
  }));
}

// MICROSOFT (OIDC)
if (MICROSOFT_CLIENT_ID && MICROSOFT_CLIENT_SECRET) {
  passport.use('azuread-openidconnect', new MicrosoftStrategy({
    identityMetadata: `https://login.microsoftonline.com/${MICROSOFT_TENANT_ID}/v2.0/.well-known/openid-configuration`,
    clientID: MICROSOFT_CLIENT_ID,
    clientSecret: MICROSOFT_CLIENT_SECRET,
    responseType: 'code id_token',
    responseMode: 'form_post',
    redirectUrl: `${OAUTH_CALLBACK_BASE}/microsoft/callback`,
    allowHttpForRedirectUrl: true, // ok for local dev; remove for prod
    passReqToCallback: true,
    scope: ['profile','email','openid']
  }, async (req, iss, sub, profile, accessToken, refreshToken, params, done) => {
    try {
      // passport-azure-ad gives profile in different shape; ensure email extraction
      const p = profile || (params && params.id_token) || {};
      const user = await findOrCreateOAuthUser('microsoft', profile || {});
      done(null, user);
    } catch (err) {
      done(err);
    }
  }));
}

// // APPLE
// if (APPLE_CLIENT_ID && APPLE_TEAM_ID && APPLE_KEY_ID && APPLE_PRIVATE_KEY_PATH) {
//   // read private key
//   const privateKey = fs.readFileSync(APPLE_PRIVATE_KEY_PATH, 'utf8');
//   passport.use(new AppleStrategy({
//     clientID: APPLE_CLIENT_ID,
//     teamID: APPLE_TEAM_ID,
//     keyID: APPLE_KEY_ID,
//     privateKey,
//     callbackURL: `${OAUTH_CALLBACK_BASE}/apple/callback`,
//     passReqToCallback: true
//   }, async (req, accessToken, refreshToken, idToken, profile, done) => {
//     try {
//       // Apple often returns minimal profile; idToken may have email
//       const oauthProfile = profile || {};
//       if (idToken && idToken.email) oauthProfile.emails = [{ value: idToken.email }];
//       const user = await findOrCreateOAuthUser('apple', oauthProfile);
//       done(null, user);
//     } catch (err) {
//       done(err);
//     }
//   }));
// }

module.exports = passport;