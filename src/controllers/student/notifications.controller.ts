import { Response } from 'express';
import { ExpressRequest } from '../../types/types';
import mongoose from 'mongoose';
import { NotificationRead } from '../../models/notification_read.schema';
import { sendResponse, sendError } from '../../utils/sendResponse';

export const getNotifications = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user!._id);

    const notificationReads = await NotificationRead.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate({
        path: 'notification',
        select: 'title message type sentAt createdAt',
      });

    const unreadCount = await NotificationRead.countDocuments({ user: userId, read: false });

    const notifications = notificationReads.map((nr) => ({
      _id: nr._id,
      notification: nr.notification,
      read: nr.read,
      readAt: nr.readAt,
      createdAt: nr.createdAt,
    }));

    sendResponse(res, 200, { unreadCount, notifications });
  } catch (err) {
    console.error('[GetNotifications Error]', err);
    sendError(res, 500, 'Failed to load notifications. Please try again.');
  }
};

export const markNotificationRead = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const { notificationId } = req.params;
    const userId = new mongoose.Types.ObjectId(req.user!._id);

    const notificationRead = await NotificationRead.findOneAndUpdate(
      { notification: notificationId, user: userId },
      { $set: { read: true, readAt: new Date() } },
      { new: true }
    );

    if (!notificationRead) {
      sendError(res, 404, 'Notification not found.');
      return;
    }

    sendResponse(res, 200, { read: true, readAt: notificationRead.readAt });
  } catch (err) {
    console.error('[MarkNotificationRead Error]', err);
    sendError(res, 500, 'Failed to mark notification as read. Please try again.');
  }
};

export const markAllNotificationsRead = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user!._id);

    const result = await NotificationRead.updateMany(
      { user: userId, read: false },
      { $set: { read: true, readAt: new Date() } }
    );

    sendResponse(res, 200, { updatedCount: result.modifiedCount });
  } catch (err) {
    console.error('[MarkAllNotificationsRead Error]', err);
    sendError(res, 500, 'Failed to mark notifications as read. Please try again.');
  }
};
