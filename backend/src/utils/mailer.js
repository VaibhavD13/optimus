// backend/src/utils/mailer.js
const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: +process.env.SMTP_PORT || 587,
  secure: process.env.SMTP_PORT == '465', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

async function sendResetEmail(to, resetUrl) {
  const from = process.env.FROM_EMAIL || 'no-reply@optimus.com';
  const html = `
    <div style="font-family: Inter, system-ui, Arial; color:#0f172a;">
      <h2 style="color:#0f172a">Reset your Optimus password</h2>
      <p>We received a request to reset your password. Click the link below to set a new password. This link expires in 1 hour.</p>
      <p><a href="${resetUrl}" style="background:#2563eb;color:white;padding:10px 14px;border-radius:8px;text-decoration:none">Reset password</a></p>
      <p>If you didn’t request this, you can ignore this email.</p>
    </div>`;
  await transport.sendMail({
    from,
    to,
    subject: 'Optimus — Reset your password',
    html
  });
}

module.exports = { sendResetEmail };