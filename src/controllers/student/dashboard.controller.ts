import { Response } from 'express';
import { ExpressRequest } from '../../types/types';
import mongoose from 'mongoose';
import { Course } from '../../models/course.schema';
import { Lesson } from '../../models/lesson.schema';
import { Progress } from '../../models/progress.schema';
import { ActivityLog } from '../../models/activity_log.schema';
import { Banner } from '../../models/banner.schema';
import { AdminSettings } from '../../models/admin_settings.schema';
import { sendResponse } from '../../utils/sendResponse';

export const getDashboardStats = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user!._id);

    // Enrolled: distinct courses with any progress record
    const enrolledCourseIds = await Progress.distinct('course', { user: userId });
    const enrolled = enrolledCourseIds.length;

    // For each enrolled course, check if all published lessons are completed
    let completedCourses = 0;
    for (const courseId of enrolledCourseIds) {
      const totalPublished = await Lesson.countDocuments({ course: courseId, status: 'published' });
      if (totalPublished === 0) continue;

      const completedCount = await Progress.countDocuments({
        user: userId,
        course: courseId,
        completed: true,
      });

      if (completedCount >= totalPublished) {
        completedCourses++;
      }
    }

    const inProgress = enrolled - completedCourses;

    const lessonsCompleted = await Progress.countDocuments({ user: userId, completed: true });

    sendResponse(res, 200, {
      stats: {
        enrolled,
        completed: completedCourses,
        inProgress,
        lessonsCompleted,
      },
    });
  } catch (err) {
    console.error('[GetDashboardStats Error]', err);
    sendResponse(res, 500, { error: 'Internal server error.' });
  }
};

export const getContinueLearning = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user!._id);

    const progress = await Progress.findOne({ user: userId, lastWatched: { $exists: true, $ne: null } })
      .sort({ lastWatched: -1 })
      .populate({ path: 'lesson', select: 'title subheading order module' })
      .populate({ path: 'course', select: 'title thumbnail status' });

    if (!progress || !progress.lesson || !progress.course) {
      sendResponse(res, 200, { continueLearning: null });
      return;
    }

    const courseId = progress.course._id;
    const totalLessons = await Lesson.countDocuments({ course: courseId, status: 'published' });
    const completedLessons = await Progress.countDocuments({ user: userId, course: courseId, completed: true });
    const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    sendResponse(res, 200, {
      continueLearning: {
        lessonId: progress.lesson._id,
        lessonTitle: (progress.lesson as { title?: string }).title,
        courseId: progress.course._id,
        courseTitle: (progress.course as { title?: string }).title,
        courseThumbnail: (progress.course as { thumbnail?: string }).thumbnail,
        lastWatched: progress.lastWatched,
        completed: progress.completed,
        progressPercent,
        completedLessons,
        totalLessons,
      },
    });
  } catch (err) {
    console.error('[GetContinueLearning Error]', err);
    sendResponse(res, 500, { error: 'Internal server error.' });
  }
};

export const getDashboardBanners = async (_req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const banners = await Banner.find({ status: 'active' }).sort({ order: 1 });
    sendResponse(res, 200, { banners });
  } catch (err) {
    console.error('[GetDashboardBanners Error]', err);
    sendResponse(res, 500, { error: 'Internal server error.' });
  }
};

export const getCommunityBanner = async (_req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const settings = await AdminSettings.findOne().lean();
    sendResponse(res, 200, { discordInviteUrl: settings?.discordInviteUrl || null });
  } catch (err) {
    console.error('[GetCommunityBanner Error]', err);
    sendResponse(res, 500, { error: 'Internal server error.' });
  }
};

export const getWatchTime = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user!._id);

    const watchEvents = await ActivityLog.countDocuments({ user: userId, action: 'watched' });

    sendResponse(res, 200, { watchTime: { totalWatchEvents: watchEvents } });
  } catch (err) {
    console.error('[GetWatchTime Error]', err);
    sendResponse(res, 500, { error: 'Internal server error.' });
  }
};

export const getRecentActivity = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user!._id);

    const activities = await ActivityLog.find({
      user: userId,
      action: { $in: ['watched', 'completed'] },
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate({ path: 'lesson', select: 'title' })
      .populate({ path: 'course', select: 'title' });

    sendResponse(res, 200, { activities });
  } catch (err) {
    console.error('[GetRecentActivity Error]', err);
    sendResponse(res, 500, { error: 'Internal server error.' });
  }
};
