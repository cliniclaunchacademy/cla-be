import { Response } from 'express';
import { ExpressRequest } from '../types/types';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.schema';
import { ActivityLog } from '../models/activity_log.schema';
import { sendResponse } from '../utils/sendResponse';
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
      sendResponse(res, 400, { error: error.details[0].message });
      return;
    }

    const { email, password } = value;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      sendResponse(res, 401, { error: 'Incorrect email or password.' });
      return;
    }

    if (user.status === 'banned') {
      sendResponse(res, 403, { error: 'Your account has been suspended.' });
      return;
    }

    if (user.status === 'inactive') {
      sendResponse(res, 403, { error: 'Your account is inactive. Please contact support.' });
      return;
    }

    if (!user.is_whitelisted) {
      sendResponse(res, 403, { error: 'Your account is not authorized to access this platform.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      sendResponse(res, 401, { error: 'Incorrect email or password.' });
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
      sendResponse(res, 500, { error: 'Server configuration error.' });
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
    sendResponse(res, 500, { error: 'Internal server error.' });
  }
};

export const forgotPassword = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const { error, value } = forgotPasswordSchema.validate(req.body);
    if (error) {
      sendResponse(res, 400, { error: error.details[0].message });
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
    sendResponse(res, 500, { error: 'Internal server error.' });
  }
};

export const resetPassword = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const { error, value } = resetPasswordSchema.validate(req.body);
    if (error) {
      sendResponse(res, 400, { error: error.details[0].message });
      return;
    }

    const { token, password, confirmPassword } = value;

    if (password !== confirmPassword) {
      sendResponse(res, 400, { error: 'Passwords do not match.' });
      return;
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetToken: hashedToken,
      resetTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      sendResponse(res, 400, { error: 'Reset link is invalid or has expired.' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    sendResponse(res, 200, { message: 'Password updated. Please log in.' });
  } catch (err) {
    console.error('[ResetPassword Error]', err);
    sendResponse(res, 500, { error: 'Internal server error.' });
  }
};
