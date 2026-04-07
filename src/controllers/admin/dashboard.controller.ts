import { Response } from 'express';
import { ExpressRequest } from '../../types/types';
import mongoose from 'mongoose';
import { User } from '../../models/user.schema';
import { Course } from '../../models/course.schema';
import { Progress } from '../../models/progress.schema';
import { ActivityLog } from '../../models/activity_log.schema';
import { Notification } from '../../models/notification.schema';
import { sendResponse, sendError } from '../../utils/sendResponse';

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
    sendError(res, 500, 'Failed to load dashboard stats. Please try again.');
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
    sendError(res, 500, 'Failed to load recently joined users. Please try again.');
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
    sendError(res, 500, 'Failed to load notification history. Please try again.');
  }
};

export const getWeeklySignups = async (_req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const twelveWeeksAgo = new Date(Date.now() - 12 * 7 * 24 * 60 * 60 * 1000);

    const result = await User.aggregate([
      { $match: { role: 'student', createdAt: { $gte: twelveWeeksAgo } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%G-%V', date: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { week: '$_id', count: 1, _id: 0 } },
    ]);

    sendResponse(res, 200, { weeklySignups: result });
  } catch (err) {
    console.error('[AdminWeeklySignups Error]', err);
    sendError(res, 500, 'Failed to load weekly signups. Please try again.');
  }
};

export const getPopularCourses = async (_req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const result = await Progress.aggregate([
      { $group: { _id: '$course', enrollments: { $addToSet: '$user' } } },
      { $project: { enrollmentCount: { $size: '$enrollments' } } },
      { $sort: { enrollmentCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'courses',
          localField: '_id',
          foreignField: '_id',
          as: 'course',
        },
      },
      { $unwind: '$course' },
      {
        $project: {
          _id: '$course._id',
          title: '$course.title',
          thumbnail: '$course.thumbnail',
          status: '$course.status',
          enrollmentCount: 1,
        },
      },
    ]);

    sendResponse(res, 200, { popularCourses: result });
  } catch (err) {
    console.error('[AdminPopularCourses Error]', err);
    sendError(res, 500, 'Failed to load popular courses. Please try again.');
  }
};

export const getActivityHeatmap = async (_req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const result = await ActivityLog.aggregate([
      { $match: { action: { $in: ['watched', 'completed'] } } },
      {
        $group: {
          _id: {
            dayOfWeek: { $dayOfWeek: '$createdAt' },
            hour: { $hour: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.dayOfWeek': 1, '_id.hour': 1 } },
      {
        $project: {
          dayOfWeek: '$_id.dayOfWeek',
          hour: '$_id.hour',
          count: 1,
          _id: 0,
        },
      },
    ]);

    sendResponse(res, 200, { heatmap: result });
  } catch (err) {
    console.error('[AdminActivityHeatmap Error]', err);
    sendError(res, 500, 'Failed to load activity heatmap. Please try again.');
  }
};

export const getAtRiskLearners = async (_req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    // Users who have logged in at least once but not in the last 7 days
    const recentlyActiveUserIds = await ActivityLog.distinct('user', {
      action: 'login',
      createdAt: { $gte: sevenDaysAgo },
    });

    const everLoggedInUserIds = await ActivityLog.distinct('user', { action: 'login' });

    const atRiskIds = everLoggedInUserIds.filter(
      (id) => !recentlyActiveUserIds.some((rid) => rid.toString() === id.toString())
    );

    const users = await User.find({
      _id: { $in: atRiskIds },
      role: 'student',
    })
      .select('firstName lastName email lastLogin createdAt')
      .lean();

    const lastLogins = await ActivityLog.aggregate([
      { $match: { user: { $in: atRiskIds }, action: 'login' } },
      { $sort: { createdAt: -1 } },
      { $group: { _id: '$user', lastLogin: { $first: '$createdAt' } } },
    ]);

    const lastLoginMap: Record<string, Date> = {};
    for (const entry of lastLogins) {
      lastLoginMap[entry._id.toString()] = entry.lastLogin;
    }

    const result = users.map((u) => ({
      ...u,
      lastLogin: lastLoginMap[(u._id as mongoose.Types.ObjectId).toString()] || null,
    }));

    sendResponse(res, 200, { atRiskLearners: result });
  } catch (err) {
    console.error('[AdminAtRiskLearners Error]', err);
    sendError(res, 500, 'Failed to load at-risk learners. Please try again.');
  }
};

export const getUserOverview = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const user = await User.findById(userObjectId).select('-password -resetToken -resetTokenExpiry');
    if (!user) {
      sendError(res, 404, 'User not found.');
      return;
    }

    const enrolledCourseIds = await Progress.distinct('course', { user: userObjectId });
    const enrolled = enrolledCourseIds.length;

    const completedLessons = await Progress.countDocuments({ user: userObjectId, completed: true });
    const inProgressCount = await Progress.countDocuments({ user: userObjectId, completed: false });

    const recentActivity = await ActivityLog.find({ user: userObjectId })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate({ path: 'lesson', select: 'title' })
      .populate({ path: 'course', select: 'title' });

    sendResponse(res, 200, {
      user,
      stats: {
        enrolledCourses: enrolled,
        completedLessons,
        inProgress: inProgressCount,
      },
      recentActivity,
    });
  } catch (err) {
    console.error('[AdminGetUserOverview Error]', err);
    sendError(res, 500, 'Failed to load user overview. Please try again.');
  }
};
