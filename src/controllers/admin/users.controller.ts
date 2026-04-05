import { Response } from 'express';
import { ExpressRequest } from '../../types/types';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { User } from '../../models/user.schema';
import { Progress } from '../../models/progress.schema';
import { ActivityLog } from '../../models/activity_log.schema';
import { sendResponse, sendError } from '../../utils/sendResponse';
import { sendWelcomeEmail, sendWelcomeSetPasswordEmail } from '../../utils/email';
import { createUserSchema, editUserSchema } from '../../validators/admin.validator';

export const getUsers = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;
    const { search, role, status } = req.query;

    const filter: Record<string, unknown> = {};
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } },
      ];
    }
    if (role) filter.role = role;
    if (status) filter.status = status;

    const [users, total] = await Promise.all([
      User.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-password -resetToken -resetTokenExpiry'),
      User.countDocuments(filter),
    ]);

    sendResponse(res, 200, {
      users,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error('[AdminGetUsers Error]', err);
    sendError(res, 500, 'Failed to load users. Please try again.');
  }
};

export const createUser = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const { error, value } = createUserSchema.validate(req.body);
    if (error) {
      sendError(res, 400, error.details[0].message);
      return;
    }

    const { username, email, firstName, lastName, password, role, sendWelcomeEmail: shouldSendEmail } = value;

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      sendError(res, 400, 'A user with this email address already exists.');
      return;
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      sendError(res, 400, 'This username is already taken. Please choose a different one.');
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      email,
      firstName,
      lastName,
      password: hashedPassword,
      role,
      status: 'active',
      is_whitelisted: true,
    });

    if (shouldSendEmail) {
      try {
        await sendWelcomeEmail(email, firstName, lastName, password);
        await User.findByIdAndUpdate(user._id, { welcomeEmailSent: true });
      } catch (emailErr: unknown) {
        console.error('[SendWelcomeEmail Error]', emailErr instanceof Error ? emailErr.message : emailErr);
      }
    }

    const userObj = user.toObject() as unknown as Record<string, unknown>;
    delete userObj.password;
    delete userObj.resetToken;
    delete userObj.resetTokenExpiry;

    sendResponse(res, 201, { user: userObj, message: 'User created successfully.' });
  } catch (err) {
    console.error('[AdminCreateUser Error]', err);
    sendError(res, 500, 'Failed to create user. Please try again.');
  }
};

export const updateUser = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const { error, value } = editUserSchema.validate(req.body);
    if (error) {
      sendError(res, 400, error.details[0].message);
      return;
    }

    const { userId } = req.params;
    const { username, firstName, lastName, email, role, password, status } = value;

    const user = await User.findById(userId);
    if (!user) {
      sendError(res, 404, 'User not found.');
      return;
    }

    if (username && username !== user.username) {
      const existing = await User.findOne({ username, _id: { $ne: userId } });
      if (existing) {
        sendError(res, 400, 'This username is already taken. Please choose a different one.');
        return;
      }
    }

    if (email && email !== user.email) {
      const existing = await User.findOne({ email, _id: { $ne: userId } });
      if (existing) {
        sendError(res, 400, 'A user with this email address already exists.');
        return;
      }
    }

    const updateData: Record<string, unknown> = {};
    if (username) updateData.username = username;
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    if (status) updateData.status = status;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const updated = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    ).select('-password -resetToken -resetTokenExpiry');

    sendResponse(res, 200, { user: updated, message: 'User updated successfully.' });
  } catch (err) {
    console.error('[AdminUpdateUser Error]', err);
    sendError(res, 500, 'Failed to update user. Please try again.');
  }
};

export const banUser = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { status: 'banned' } },
      { new: true }
    ).select('-password -resetToken -resetTokenExpiry');

    if (!user) {
      sendError(res, 404, 'User not found.');
      return;
    }

    sendResponse(res, 200, { user, message: 'User has been banned.' });
  } catch (err) {
    console.error('[AdminBanUser Error]', err);
    sendError(res, 500, 'Failed to ban user. Please try again.');
  }
};

export const unbanUser = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { status: 'active' } },
      { new: true }
    ).select('-password -resetToken -resetTokenExpiry');

    if (!user) {
      sendError(res, 404, 'User not found.');
      return;
    }

    sendResponse(res, 200, { user, message: 'User has been unbanned.' });
  } catch (err) {
    console.error('[AdminUnbanUser Error]', err);
    sendError(res, 500, 'Failed to unban user. Please try again.');
  }
};

export const resendWelcomeEmail = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      sendError(res, 404, 'User not found.');
      return;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await User.findByIdAndUpdate(userId, { resetToken, resetTokenExpiry, welcomeEmailSent: true });
    await sendWelcomeSetPasswordEmail(user.email, user.firstName, user.lastName, resetToken);

    sendResponse(res, 200, { message: 'Welcome email sent successfully.' });
  } catch (err) {
    console.error('[AdminResendWelcomeEmail Error]', err);
    sendError(res, 500, 'Failed to send welcome email. Please try again.');
  }
};

export const deleteUser = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      sendError(res, 404, 'User not found.');
      return;
    }

    await Promise.all([
      User.findByIdAndDelete(userId),
      Progress.deleteMany({ user: userId }),
      ActivityLog.deleteMany({ user: userId }),
    ]);

    sendResponse(res, 200, { message: 'User deleted successfully.' });
  } catch (err) {
    console.error('[AdminDeleteUser Error]', err);
    sendError(res, 500, 'Failed to delete user. Please try again.');
  }
};
