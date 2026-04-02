"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPasswordResetEmail = exports.sendWelcomeSetPasswordEmail = exports.sendWelcomeEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const createTransporter = () => {
    return nodemailer_1.default.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
};
const loadTemplate = (templateName, replacements) => {
    const templatePath = path_1.default.join(process.cwd(), 'email-templates', templateName);
    let html = fs_1.default.readFileSync(templatePath, 'utf-8');
    for (const [key, value] of Object.entries(replacements)) {
        html = html.split(`{{${key}}}`).join(value);
    }
    return html;
};
const sendWelcomeEmail = async (to, firstName, lastName, password) => {
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
exports.sendWelcomeEmail = sendWelcomeEmail;
const sendWelcomeSetPasswordEmail = async (to, firstName, lastName, resetToken) => {
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
exports.sendWelcomeSetPasswordEmail = sendWelcomeSetPasswordEmail;
const sendPasswordResetEmail = async (to, resetToken) => {
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
exports.sendPasswordResetEmail = sendPasswordResetEmail;
//# sourceMappingURL=email.js.map