import nodemailer from 'nodemailer';

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

export const sendWelcomeEmail = async (
  to: string,
  firstName: string,
  password: string
): Promise<void> => {
  const transporter = createTransporter();
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2c3e50;">Welcome to Clinic Launch Academy, ${firstName}!</h2>
      <p>Your account has been created. Here are your login credentials:</p>
      <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Email:</strong> ${to}</p>
        <p><strong>Temporary Password:</strong> ${password}</p>
      </div>
      <p>Please log in and change your password as soon as possible.</p>
      <a href="${frontendUrl}/login"
         style="display: inline-block; background: #3498db; color: white; padding: 12px 24px;
                text-decoration: none; border-radius: 6px; margin-top: 10px;">
        Login to your account
      </a>
      <p style="margin-top: 20px; color: #7f8c8d; font-size: 12px;">
        If you did not request this account, please contact support.
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'no-reply@cliniclaunch.com',
    to,
    subject: 'Welcome to Clinic Launch Academy',
    html,
  });
};

export const sendPasswordResetEmail = async (
  to: string,
  resetToken: string
): Promise<void> => {
  const transporter = createTransporter();
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2c3e50;">Password Reset Request</h2>
      <p>You have requested to reset your password for your Clinic Launch Academy account.</p>
      <p>Click the button below to reset your password. This link will expire in 1 hour.</p>
      <a href="${resetUrl}"
         style="display: inline-block; background: #e74c3c; color: white; padding: 12px 24px;
                text-decoration: none; border-radius: 6px; margin-top: 10px;">
        Reset Password
      </a>
      <p style="margin-top: 15px;">Or copy and paste this link:</p>
      <p style="color: #3498db; word-break: break-all;">${resetUrl}</p>
      <p style="margin-top: 20px; color: #7f8c8d; font-size: 12px;">
        If you did not request a password reset, please ignore this email or contact support if you have concerns.
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'no-reply@cliniclaunch.com',
    to,
    subject: 'Password Reset - Clinic Launch Academy',
    html,
  });
};
