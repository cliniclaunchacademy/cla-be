import { Response } from 'express';
import { ExpressRequest } from '../../types/types';
import mongoose from 'mongoose';
import { Course } from '../../models/course.schema';
import { Module } from '../../models/module.schema';
import { Lesson } from '../../models/lesson.schema';
import { LessonResource } from '../../models/lesson_resource.schema';
import { Progress } from '../../models/progress.schema';
import { ActivityLog } from '../../models/activity_log.schema';
import { sendResponse } from '../../utils/sendResponse';

export const getCourses = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user!._id);

    const courses = await Course.find({
      $or: [{ status: 'published' }, { comingSoon: true }],
    })
      .sort({ order: 1 })
      .populate({ path: 'instructor', select: 'firstName lastName title photo' });

    const coursesWithProgress = await Promise.all(
      courses.map(async (course) => {
        const totalPublished = await Lesson.countDocuments({ course: course._id, status: 'published' });
        const completedLessons = await Progress.countDocuments({
          user: userId,
          course: course._id,
          completed: true,
        });

        const progressPercent =
          totalPublished > 0 ? Math.round((completedLessons / totalPublished) * 100) : 0;

        return {
          ...course.toObject(),
          totalLessons: totalPublished,
          completedLessons,
          progressPercent,
        };
      })
    );

    sendResponse(res, 200, { courses: coursesWithProgress });
  } catch (err) {
    console.error('[GetCourses Error]', err);
    sendResponse(res, 500, { error: 'Internal server error.' });
  }
};

export const getCourseDetail = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const { courseId } = req.params;
    const userId = new mongoose.Types.ObjectId(req.user!._id);

    const course = await Course.findById(courseId).populate({
      path: 'instructor',
      select: 'firstName lastName title bio photo',
    });

    if (!course) {
      sendResponse(res, 404, { error: 'Course not found.' });
      return;
    }

    const modules = await Module.find({ course: courseId }).sort({ order: 1 });

    const modulesWithLessons = await Promise.all(
      modules.map(async (mod) => {
        const lessons = await Lesson.find({ module: mod._id }).sort({ order: 1 });

        const lessonsWithProgress = await Promise.all(
          lessons.map(async (lesson) => {
            const progress = await Progress.findOne({
              user: userId,
              lesson: lesson._id,
            });
            return {
              ...lesson.toObject(),
              completed: progress?.completed || false,
              lastWatched: progress?.lastWatched || null,
            };
          })
        );

        return {
          ...mod.toObject(),
          lessons: lessonsWithProgress,
        };
      })
    );

    sendResponse(res, 200, {
      course: course.toObject(),
      modules: modulesWithLessons,
    });
  } catch (err) {
    console.error('[GetCourseDetail Error]', err);
    sendResponse(res, 500, { error: 'Internal server error.' });
  }
};

export const getLessonDetail = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const { courseId, lessonId } = req.params;
    const userId = new mongoose.Types.ObjectId(req.user!._id);

    const lesson = await Lesson.findOne({ _id: lessonId, course: courseId });
    if (!lesson) {
      sendResponse(res, 404, { error: 'Lesson not found.' });
      return;
    }

    // Upsert progress, update lastWatched
    await Progress.findOneAndUpdate(
      { user: userId, course: courseId, lesson: lessonId },
      { $set: { lastWatched: new Date() } },
      { upsert: true, new: true }
    );

    // Log watched activity
    await ActivityLog.create({
      user: userId,
      lesson: lesson._id,
      course: new mongoose.Types.ObjectId(courseId),
      action: 'watched',
    });

    // Get published resources
    const resources = await LessonResource.find({ lesson: lessonId, status: 'published' }).sort({ order: 1 });

    // Get sidebar: all modules + lessons with completion status
    const modules = await Module.find({ course: courseId }).sort({ order: 1 });

    const sidebar = await Promise.all(
      modules.map(async (mod) => {
        const lessons = await Lesson.find({ module: mod._id }).sort({ order: 1 });

        const lessonsWithStatus = await Promise.all(
          lessons.map(async (l) => {
            const progress = await Progress.findOne({ user: userId, lesson: l._id });
            return {
              ...l.toObject(),
              completed: progress?.completed || false,
              lastWatched: progress?.lastWatched || null,
              isActive: l._id.toString() === lessonId,
            };
          })
        );

        return {
          ...mod.toObject(),
          lessons: lessonsWithStatus,
        };
      })
    );

    const currentProgress = await Progress.findOne({ user: userId, lesson: lessonId });

    sendResponse(res, 200, {
      lesson: lesson.toObject(),
      resources,
      sidebar,
      progress: {
        completed: currentProgress?.completed || false,
        lastWatched: currentProgress?.lastWatched || null,
        flaggedVideo: currentProgress?.flaggedVideo || false,
      },
    });
  } catch (err) {
    console.error('[GetLessonDetail Error]', err);
    sendResponse(res, 500, { error: 'Internal server error.' });
  }
};

export const completeLesson = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const { courseId, lessonId } = req.params;
    const userId = new mongoose.Types.ObjectId(req.user!._id);

    const existingProgress = await Progress.findOne({ user: userId, lesson: lessonId });
    const isFirstCompletion = !existingProgress?.completed;

    const progress = await Progress.findOneAndUpdate(
      { user: userId, course: courseId, lesson: lessonId },
      { $set: { completed: true, completedAt: new Date(), lastWatched: new Date() } },
      { upsert: true, new: true }
    );

    if (isFirstCompletion) {
      await ActivityLog.create({
        user: userId,
        lesson: new mongoose.Types.ObjectId(lessonId),
        course: new mongoose.Types.ObjectId(courseId),
        action: 'completed',
      });
    }

    const totalPublished = await Lesson.countDocuments({ course: courseId, status: 'published' });
    const completedCount = await Progress.countDocuments({
      user: userId,
      course: courseId,
      completed: true,
    });

    const courseProgressPercent =
      totalPublished > 0 ? Math.round((completedCount / totalPublished) * 100) : 0;

    sendResponse(res, 200, {
      completed: true,
      completedAt: progress.completedAt,
      courseProgressPercent,
    });
  } catch (err) {
    console.error('[CompleteLesson Error]', err);
    sendResponse(res, 500, { error: 'Internal server error.' });
  }
};

export const flagVideo = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const { courseId, lessonId } = req.params;
    const userId = new mongoose.Types.ObjectId(req.user!._id);

    await Progress.findOneAndUpdate(
      { user: userId, course: courseId, lesson: lessonId },
      { $set: { flaggedVideo: true } },
      { upsert: true, new: true }
    );

    sendResponse(res, 200, { flagged: true });
  } catch (err) {
    console.error('[FlagVideo Error]', err);
    sendResponse(res, 500, { error: 'Internal server error.' });
  }
};

export const getStudentResources = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    // Find all published resources grouped by course
    const resources = await LessonResource.find({ status: 'published' })
      .populate({ path: 'course', select: 'title thumbnail status' })
      .populate({ path: 'lesson', select: 'title' })
      .sort({ course: 1, order: 1 });

    // Group by course
    const grouped: Record<string, { course: Record<string, unknown>; resources: unknown[] }> = {};

    for (const resource of resources) {
      const courseObj = resource.course as { _id: { toString(): string }; title?: string; thumbnail?: string; status?: string } | null;
      if (!courseObj) continue;

      const courseIdStr = courseObj._id.toString();
      if (!grouped[courseIdStr]) {
        grouped[courseIdStr] = {
          course: courseObj as unknown as Record<string, unknown>,
          resources: [],
        };
      }
      grouped[courseIdStr].resources.push(resource.toObject());
    }

    sendResponse(res, 200, { resources: Object.values(grouped) });
  } catch (err) {
    console.error('[GetStudentResources Error]', err);
    sendResponse(res, 500, { error: 'Internal server error.' });
  }
};
