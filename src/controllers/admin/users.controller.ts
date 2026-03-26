import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../../models/user.schema';
import { Progress } from '../../models/progress.schema';
import { ActivityLog } from '../../models/activity_log.schema';
import { sendResponse } from '../../utils/sendResponse';
import { sendWelcomeEmail } from '../../utils/email';
import { createUserSchema, editUserSchema } from '../../validators/admin.validator';

export const getUsers = async (req: Request, res: Response): Promise<void> => {
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
    sendResponse(res, 500, { error: 'Internal server error.' });
  }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { error, value } = createUserSchema.validate(req.body);
    if (error) {
      sendResponse(res, 400, { error: error.details[0].message });
      return;
    }

    const { username, email, firstName, lastName, password, role, sendWelcomeEmail: shouldSendEmail } = value;

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      sendResponse(res, 400, { error: 'Email is already registered.' });
      return;
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      sendResponse(res, 400, { error: 'Username is already taken.' });
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
        await sendWelcomeEmail(email, firstName, password);
        await User.findByIdAndUpdate(user._id, { welcomeEmailSent: true });
      } catch (emailErr) {
        console.error('[SendWelcomeEmail Error]', emailErr);
      }
    }

    const userObj = user.toObject() as unknown as Record<string, unknown>;
    delete userObj.password;
    delete userObj.resetToken;
    delete userObj.resetTokenExpiry;

    sendResponse(res, 201, { user: userObj, message: 'User created successfully.' });
  } catch (err) {
    console.error('[AdminCreateUser Error]', err);
    sendResponse(res, 500, { error: 'Internal server error.' });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { error, value } = editUserSchema.validate(req.body);
    if (error) {
      sendResponse(res, 400, { error: error.details[0].message });
      return;
    }

    const { userId } = req.params;
    const { username, firstName, lastName, email, role, password, status } = value;

    const user = await User.findById(userId);
    if (!user) {
      sendResponse(res, 404, { error: 'User not found.' });
      return;
    }

    if (username && username !== user.username) {
      const existing = await User.findOne({ username, _id: { $ne: userId } });
      if (existing) {
        sendResponse(res, 400, { error: 'Username is already taken.' });
        return;
      }
    }

    if (email && email !== user.email) {
      const existing = await User.findOne({ email, _id: { $ne: userId } });
      if (existing) {
        sendResponse(res, 400, { error: 'Email is already registered.' });
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
    sendResponse(res, 500, { error: 'Internal server error.' });
  }
};

export const banUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { status: 'banned' } },
      { new: true }
    ).select('-password -resetToken -resetTokenExpiry');

    if (!user) {
      sendResponse(res, 404, { error: 'User not found.' });
      return;
    }

    sendResponse(res, 200, { user, message: 'User has been banned.' });
  } catch (err) {
    console.error('[AdminBanUser Error]', err);
    sendResponse(res, 500, { error: 'Internal server error.' });
  }
};

export const unbanUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { status: 'active' } },
      { new: true }
    ).select('-password -resetToken -resetTokenExpiry');

    if (!user) {
      sendResponse(res, 404, { error: 'User not found.' });
      return;
    }

    sendResponse(res, 200, { user, message: 'User has been unbanned.' });
  } catch (err) {
    console.error('[AdminUnbanUser Error]', err);
    sendResponse(res, 500, { error: 'Internal server error.' });
  }
};

export const resendWelcomeEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      sendResponse(res, 404, { error: 'User not found.' });
      return;
    }

    // We don't have the plain password, so send a reset-type welcome
    await sendWelcomeEmail(user.email, user.firstName, '(Please use your existing password)');
    await User.findByIdAndUpdate(userId, { welcomeEmailSent: true });

    sendResponse(res, 200, { message: 'Welcome email resent successfully.' });
  } catch (err) {
    console.error('[AdminResendWelcomeEmail Error]', err);
    sendResponse(res, 500, { error: 'Internal server error.' });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      sendResponse(res, 404, { error: 'User not found.' });
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
    sendResponse(res, 500, { error: 'Internal server error.' });
  }
};
