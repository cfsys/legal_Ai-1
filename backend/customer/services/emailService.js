const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

// Setup transporter with Google App Password
const getTransporter = () => {
  const user = process.env.EMAIL_USER || 'divya.1505shah@gmail.com';
  // Strip whitespace from 16-character app password if present
  const pass = (process.env.EMAIL_PASS || 'azgtjdvblhjuwybl').replace(/\s+/g, '');

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user,
      pass,
    },
  });
};

/**
 * Send 6-digit OTP to user's email address
 * @param {string} email - Destination email address
 * @param {string} otp - 6-digit numeric code
 * @param {string} purpose - 'Registration' | 'Login' | 'Password Reset'
 * @param {string} name - Optional user's name
 */
const sendOtpEmail = async (email, otp, purpose = 'Login Verification', name = '') => {
  const appName = process.env.APP_NAME || 'Legal AI';
  const fromAddress = process.env.EMAIL_FROM || `"${appName}" <${process.env.EMAIL_USER || 'divya.1505shah@gmail.com'}>`;

  const subject = `Your ${appName} ${purpose} Code: ${otp}`;

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <div style="max-width: 540px; margin: 40px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04); border: 1px solid #e2e8f0;">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #2563eb 100%); padding: 32px 30px; text-align: center; color: #ffffff;">
      <div style="display: inline-block; padding: 8px 16px; background: rgba(255, 255, 255, 0.12); border-radius: 9999px; backdrop-filter: blur(8px); margin-bottom: 12px;">
        <span style="font-size: 13px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #93c5fd;">⚖️ ${appName} Intelligence</span>
      </div>
      <h1 style="margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.02em;">One-Time Security Verification</h1>
    </div>

    <!-- Body Content -->
    <div style="padding: 36px 32px; text-align: center;">
      <p style="margin: 0 0 12px 0; font-size: 15px; color: #475569;">
        Hello${name ? ` <strong>${name}</strong>` : ''},
      </p>
      <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #64748b;">
        Please use the 6-digit verification code below to authorize your <strong>${purpose}</strong> request on the <strong>${appName}</strong> platform.
      </p>

      <!-- OTP Display Box -->
      <div style="background-color: #f8fafc; border: 2px dashed #6366f1; border-radius: 12px; padding: 20px 24px; margin: 24px 0; display: inline-block; min-width: 260px;">
        <div style="font-size: 11px; font-weight: 700; color: #6366f1; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 8px;">
          Your 6-Digit OTP Code
        </div>
        <div style="font-size: 36px; font-weight: 800; letter-spacing: 10px; color: #0f172a; font-family: monospace; user-select: all;">
          ${otp}
        </div>
        <div style="font-size: 12px; color: #94a3b8; margin-top: 8px;">
          ⏱️ Valid for 10 minutes only
        </div>
      </div>

      <!-- Security Notice -->
      <div style="margin-top: 28px; padding: 14px 18px; background-color: #fef2f2; border-radius: 8px; border-left: 4px solid #ef4444; text-align: left;">
        <p style="margin: 0; font-size: 12.5px; line-height: 1.5; color: #991b1b;">
          <strong>Security Note:</strong> Do not share this OTP with anyone. The ${appName} team will never ask for your verification code. If you did not initiate this request, please secure your account immediately.
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color: #f8fafc; border-top: 1px solid #f1f5f9; padding: 20px 32px; text-align: center; font-size: 12px; color: #94a3b8;">
      <p style="margin: 0 0 6px 0;">This is an automated system notification from ${appName}.</p>
      <p style="margin: 0;">&copy; ${new Date().getFullYear()} ${appName} Platform. Grounded in Indian Statutory Law & Case Law Intelligence.</p>
    </div>

  </div>
</body>
</html>
  `;

  try {
    const transporter = getTransporter();
    const info = await transporter.sendMail({
      from: fromAddress,
      to: email,
      subject,
      html: htmlContent,
      text: `Your ${appName} ${purpose} code is: ${otp}. It expires in 10 minutes.`,
    });

    logger.info('EmailService', `OTP email dispatched to ${email} (MessageID: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    logger.error('EmailService', `Failed to send email to ${email}: ${error.message}`);
    // Return error status but do not crash the application
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendOtpEmail,
  getTransporter,
};
