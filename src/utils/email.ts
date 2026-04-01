import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

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

const loadTemplate = (templateName: string, replacements: Record<string, string>): string => {
  const templatePath = path.join(process.cwd(), 'email-templates', templateName);
  let html = fs.readFileSync(templatePath, 'utf-8');
  for (const [key, value] of Object.entries(replacements)) {
    html = html.split(`{{${key}}}`).join(value);
  }
  return html;
};

export const sendWelcomeEmail = async (
  to: string,
  firstName: string,
  lastName: string,
  password: string
): Promise<void> => {
  const transporter = createTransporter();
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const supportEmail = process.env.SUPPORT_EMAIL || process.env.EMAIL_FROM || 'support@cliniclaunch.com';

  const html = loadTemplate('welcome.html', {
    firstName,
    lastName,
    email: to,
    password,
    loginUrl: `${frontendUrl}/login`,
    supportEmail,
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'no-reply@cliniclaunch.com',
    to,
    subject: 'Welcome to Clinic Launch Academy',
    html,
  });
};

export const sendWelcomeSetPasswordEmail = async (
  to: string,
  firstName: string,
  lastName: string,
  resetToken: string
): Promise<void> => {
  const transporter = createTransporter();
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const supportEmail = process.env.SUPPORT_EMAIL || process.env.EMAIL_FROM || 'support@cliniclaunch.com';
  const resetLink = `${frontendUrl}/reset-password?token=${resetToken}&welcome=true`;

  const html = loadTemplate('resend-welcome.html', {
    firstName,
    lastName,
    email: to,
    resetLink,
    supportEmail,
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'no-reply@cliniclaunch.com',
    to,
    subject: 'Welcome to Clinic Launch Academy — Set Your Password',
    html,
  });
};

export const sendPasswordResetEmail = async (
  to: string,
  resetToken: string
): Promise<void> => {
  const transporter = createTransporter();
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const supportEmail = process.env.SUPPORT_EMAIL || process.env.EMAIL_FROM || 'support@cliniclaunch.com';
  const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`;

  const html = loadTemplate('reset-password.html', {
    resetLink,
    supportEmail,
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'no-reply@cliniclaunch.com',
    to,
    subject: 'Password Reset - Clinic Launch Academy',
    html,
  });
};
