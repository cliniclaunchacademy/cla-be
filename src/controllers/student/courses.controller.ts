import { Response } from 'express';
import { ExpressRequest } from '../../types/types';
import mongoose from 'mongoose';
import { Course } from '../../models/course.schema';
import { Module } from '../../models/module.schema';
import { Lesson } from '../../models/lesson.schema';
import { LessonResource } from '../../models/lesson_resource.schema';
import { Progress } from '../../models/progress.schema';
import { ActivityLog } from '../../models/activity_log.schema';
import { sendResponse, sendError } from '../../utils/sendResponse';

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
    sendError(res, 500, 'Failed to load courses. Please try again.');
  }
};

export const getCourseDetail = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const { courseId } = req.params;
    const userId = new mongoose.Types.ObjectId(req.user!._id);

    const course = await Course.findById(courseId).populate({
      path: 'instructor',
      select: 'firstName lastName title bio photo linkedin instagram twitter website',
    });

    if (!course) {
      sendError(res, 404, 'Course not found.');
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
    sendError(res, 500, 'Failed to load course details. Please try again.');
  }
};

export const getLessonDetail = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const { courseId, lessonId } = req.params;
    const userId = new mongoose.Types.ObjectId(req.user!._id);

    const lesson = await Lesson.findOne({ _id: lessonId, course: courseId });
    if (!lesson) {
      sendError(res, 404, 'Lesson not found.');
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
    sendError(res, 500, 'Failed to load lesson. Please try again.');
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
    sendError(res, 500, 'Failed to mark lesson as complete. Please try again.');
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
    sendError(res, 500, 'Failed to flag video. Please try again.');
  }
};

export const getStudentResources = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const resources = await LessonResource.find({ status: 'published' })
      .populate({ path: 'course', select: 'title thumbnail' })
      .populate({ path: 'lesson', select: 'title' })
      .sort({ course: 1, order: 1 });

    const result = resources.map((r) => {
      const obj = r.toObject() as unknown as Record<string, unknown>;
      return {
        _id: obj._id,
        course: obj.course,
        lesson: obj.lesson,
        title: obj.title,
        type: obj.type,
        url: obj.url,
        description: obj.description,
        status: obj.status,
        order: obj.order,
        createdAt: obj.createdAt,
      };
    });

    sendResponse(res, 200, { resources: result });
  } catch (err) {
    console.error('[GetStudentResources Error]', err);
    sendError(res, 500, 'Failed to load resources. Please try again.');
  }
};
