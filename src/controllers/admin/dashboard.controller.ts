import { Response } from 'express';
import { ExpressRequest } from '../../types/types';
import { User } from '../../models/user.schema';
import { Progress } from '../../models/progress.schema';
import { ActivityLog } from '../../models/activity_log.schema';
import { Notification } from '../../models/notification.schema';
import { sendResponse } from '../../utils/sendResponse';

export const getDashboardStats = async (_req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    // Active learners last 30 days: distinct users in activity_logs
    const activeLearnersResult = await ActivityLog.distinct('user', {
      createdAt: { $gte: thirtyDaysAgo },
    });
    const activeLearnersLast30Days = activeLearnersResult.length;

    // New users this week
    const newUsersThisWeek = await User.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });

    // Total lessons completed
    const totalLessonsCompleted = await Progress.countDocuments({ completed: true });

    sendResponse(res, 200, {
      stats: {
        activeLearnersLast30Days,
        newUsersThisWeek,
        totalLessonsCompleted,
      },
    });
  } catch (err) {
    console.error('[AdminDashboardStats Error]', err);
    sendResponse(res, 500, { error: 'Internal server error.' });
  }
};

export const getRecentlyJoined = async (_req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const users = await User.find({ role: 'student' })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('-password -resetToken -resetTokenExpiry');

    sendResponse(res, 200, { users });
  } catch (err) {
    console.error('[AdminRecentlyJoined Error]', err);
    sendResponse(res, 500, { error: 'Internal server error.' });
  }
};

export const getNotificationHistory = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
      Notification.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate({ path: 'createdBy', select: 'firstName lastName email' }),
      Notification.countDocuments(),
    ]);

    sendResponse(res, 200, {
      notifications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error('[AdminNotificationHistory Error]', err);
    sendResponse(res, 500, { error: 'Internal server error.' });
  }
};
