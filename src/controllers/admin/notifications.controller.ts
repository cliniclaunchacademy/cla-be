import { Response } from 'express';
import { ExpressRequest } from '../../types/types';
import mongoose from 'mongoose';
import { User } from '../../models/user.schema';
import { Notification } from '../../models/notification.schema';
import { NotificationRead } from '../../models/notification_read.schema';
import { sendResponse, sendError } from '../../utils/sendResponse';
import { sendNotificationSchema } from '../../validators/admin.validator';

export const sendNotification = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const { error, value } = sendNotificationSchema.validate(req.body);
    if (error) {
      sendError(res, 400, error.details[0].message);
      return;
    }

    const { title, message, type, targetType, targetUsers, targetRole } = value;
    const adminId = new mongoose.Types.ObjectId(req.user!._id);

    let targetUserIds: mongoose.Types.ObjectId[] = [];

    if (targetType === 'all') {
      const users = await User.find({ role: 'student' }).select('_id');
      targetUserIds = users.map((u) => u._id as mongoose.Types.ObjectId);
    } else if (targetType === 'role' && targetRole) {
      const users = await User.find({ role: targetRole }).select('_id');
      targetUserIds = users.map((u) => u._id as mongoose.Types.ObjectId);
    } else if (targetType === 'user' && targetUsers && targetUsers.length > 0) {
      targetUserIds = targetUsers.map((id: string) => new mongoose.Types.ObjectId(id));
    }

    const notification = await Notification.create({
      title,
      message,
      type,
      targetType,
      targetUsers: targetType === 'user' ? targetUserIds : undefined,
      targetRole: targetType === 'role' ? targetRole : undefined,
      status: 'sent',
      sentAt: new Date(),
      createdBy: adminId,
    });

    // Create notification_read entries for all target users
    if (targetUserIds.length > 0) {
      const reads = targetUserIds.map((userId) => ({
        notification: notification._id,
        user: userId,
        read: false,
      }));
      await NotificationRead.insertMany(reads, { ordered: false });
    }

    sendResponse(res, 201, {
      notification,
      recipientCount: targetUserIds.length,
      message: 'Notification sent successfully.',
    });
  } catch (err) {
    console.error('[AdminSendNotification Error]', err);
    sendError(res, 500, 'Failed to send notification. Please try again.');
  }
};

export const deleteNotification = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findById(notificationId);
    if (!notification) {
      sendError(res, 404, 'Notification not found.');
      return;
    }

    await Promise.all([
      NotificationRead.deleteMany({ notification: notificationId }),
      Notification.findByIdAndDelete(notificationId),
    ]);

    sendResponse(res, 200, { message: 'Notification deleted.' });
  } catch (err) {
    console.error('[AdminDeleteNotification Error]', err);
    sendError(res, 500, 'Failed to delete notification. Please try again.');
  }
};
