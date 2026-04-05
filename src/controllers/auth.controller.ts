import { Response } from 'express';
import { ExpressRequest } from '../types/types';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.schema';
import { ActivityLog } from '../models/activity_log.schema';
import { sendResponse, sendError } from '../utils/sendResponse';
import { sendPasswordResetEmail } from '../utils/email';
import {
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../validators/auth.validator';

export const login = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      sendError(res, 400, error.details[0].message);
      return;
    }

    const { email, password } = value;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      sendError(res, 401, 'Incorrect email or password.');
      return;
    }

    if (user.status === 'banned') {
      sendError(res, 403, 'Your account has been suspended. Please contact support.');
      return;
    }

    if (user.status === 'inactive') {
      sendError(res, 403, 'Your account is inactive. Please contact support.');
      return;
    }

    if (!user.is_whitelisted) {
      sendError(res, 403, 'Your account is not authorized to access this platform. Please contact support.');
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      sendError(res, 401, 'Incorrect email or password.');
      return;
    }

    user.lastLogin = new Date();
    await user.save();

    await ActivityLog.create({
      user: user._id,
      action: 'login',
    });

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      sendError(res, 500, 'Server configuration error. Please contact support.');
      return;
    }

    const token = jwt.sign(
      { _id: user._id.toString(), role: user.role },
      secret,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as jwt.SignOptions
    );

    const userObj = user.toObject() as unknown as Record<string, unknown>;
    delete userObj.password;
    delete userObj.resetToken;
    delete userObj.resetTokenExpiry;

    sendResponse(res, 200, { token, user: userObj });
  } catch (err) {
    console.error('[Login Error]', err);
    sendError(res, 500, 'Login failed. Please try again.');
  }
};

export const forgotPassword = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const { error, value } = forgotPasswordSchema.validate(req.body);
    if (error) {
      sendError(res, 400, error.details[0].message);
      return;
    }

    const { email } = value;

    // Always return the same message to prevent email enumeration
    const successMessage = 'If this email is registered, a reset link has been sent.';

    const user = await User.findOne({ email });
    if (!user) {
      sendResponse(res, 200, { message: successMessage });
      return;
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    user.resetToken = hashedToken;
    user.resetTokenExpiry = expiry;
    await user.save();

    await sendPasswordResetEmail(user.email, rawToken);

    sendResponse(res, 200, { message: successMessage });
  } catch (err) {
    console.error('[ForgotPassword Error]', err);
    sendError(res, 500, 'Failed to send password reset email. Please try again.');
  }
};

export const resetPassword = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const { error, value } = resetPasswordSchema.validate(req.body);
    if (error) {
      sendError(res, 400, error.details[0].message);
      return;
    }

    const { token, password, confirmPassword } = value;

    if (password !== confirmPassword) {
      sendError(res, 400, 'Passwords do not match.');
      return;
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetToken: hashedToken,
      resetTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      sendError(res, 400, 'This password reset link is invalid or has expired. Please request a new one.');
      return;
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    sendResponse(res, 200, { message: 'Password updated successfully. Please log in.' });
  } catch (err) {
    console.error('[ResetPassword Error]', err);
    sendError(res, 500, 'Failed to reset password. Please try again.');
  }
};
