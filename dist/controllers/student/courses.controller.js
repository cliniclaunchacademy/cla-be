"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStudentResources = exports.flagVideo = exports.completeLesson = exports.getLessonDetail = exports.getCourseDetail = exports.getCourses = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const course_schema_1 = require("../../models/course.schema");
const module_schema_1 = require("../../models/module.schema");
const lesson_schema_1 = require("../../models/lesson.schema");
const lesson_resource_schema_1 = require("../../models/lesson_resource.schema");
const progress_schema_1 = require("../../models/progress.schema");
const activity_log_schema_1 = require("../../models/activity_log.schema");
const sendResponse_1 = require("../../utils/sendResponse");
const getCourses = async (req, res) => {
    try {
        const userId = new mongoose_1.default.Types.ObjectId(req.user._id);
        const courses = await course_schema_1.Course.find({
            $or: [{ status: 'published' }, { comingSoon: true }],
        })
            .sort({ order: 1 })
            .populate({ path: 'instructor', select: 'firstName lastName title photo' });
        const coursesWithProgress = await Promise.all(courses.map(async (course) => {
            const totalPublished = await lesson_schema_1.Lesson.countDocuments({ course: course._id, status: 'published' });
            const completedLessons = await progress_schema_1.Progress.countDocuments({
                user: userId,
                course: course._id,
                completed: true,
            });
            const progressPercent = totalPublished > 0 ? Math.round((completedLessons / totalPublished) * 100) : 0;
            return {
                ...course.toObject(),
                totalLessons: totalPublished,
                completedLessons,
                progressPercent,
            };
        }));
        (0, sendResponse_1.sendResponse)(res, 200, { courses: coursesWithProgress });
    }
    catch (err) {
        console.error('[GetCourses Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.getCourses = getCourses;
const getCourseDetail = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = new mongoose_1.default.Types.ObjectId(req.user._id);
        const course = await course_schema_1.Course.findById(courseId).populate({
            path: 'instructor',
            select: 'firstName lastName title bio photo',
        });
        if (!course) {
            (0, sendResponse_1.sendResponse)(res, 404, { error: 'Course not found.' });
            return;
        }
        const modules = await module_schema_1.Module.find({ course: courseId }).sort({ order: 1 });
        const modulesWithLessons = await Promise.all(modules.map(async (mod) => {
            const lessons = await lesson_schema_1.Lesson.find({ module: mod._id }).sort({ order: 1 });
            const lessonsWithProgress = await Promise.all(lessons.map(async (lesson) => {
                const progress = await progress_schema_1.Progress.findOne({
                    user: userId,
                    lesson: lesson._id,
                });
                return {
                    ...lesson.toObject(),
                    completed: progress?.completed || false,
                    lastWatched: progress?.lastWatched || null,
                };
            }));
            return {
                ...mod.toObject(),
                lessons: lessonsWithProgress,
            };
        }));
        (0, sendResponse_1.sendResponse)(res, 200, {
            course: course.toObject(),
            modules: modulesWithLessons,
        });
    }
    catch (err) {
        console.error('[GetCourseDetail Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.getCourseDetail = getCourseDetail;
const getLessonDetail = async (req, res) => {
    try {
        const { courseId, lessonId } = req.params;
        const userId = new mongoose_1.default.Types.ObjectId(req.user._id);
        const lesson = await lesson_schema_1.Lesson.findOne({ _id: lessonId, course: courseId });
        if (!lesson) {
            (0, sendResponse_1.sendResponse)(res, 404, { error: 'Lesson not found.' });
            return;
        }
        await progress_schema_1.Progress.findOneAndUpdate({ user: userId, course: courseId, lesson: lessonId }, { $set: { lastWatched: new Date() } }, { upsert: true, new: true });
        await activity_log_schema_1.ActivityLog.create({
            user: userId,
            lesson: lesson._id,
            course: new mongoose_1.default.Types.ObjectId(courseId),
            action: 'watched',
        });
        const resources = await lesson_resource_schema_1.LessonResource.find({ lesson: lessonId, status: 'published' }).sort({ order: 1 });
        const modules = await module_schema_1.Module.find({ course: courseId }).sort({ order: 1 });
        const sidebar = await Promise.all(modules.map(async (mod) => {
            const lessons = await lesson_schema_1.Lesson.find({ module: mod._id }).sort({ order: 1 });
            const lessonsWithStatus = await Promise.all(lessons.map(async (l) => {
                const progress = await progress_schema_1.Progress.findOne({ user: userId, lesson: l._id });
                return {
                    ...l.toObject(),
                    completed: progress?.completed || false,
                    lastWatched: progress?.lastWatched || null,
                    isActive: l._id.toString() === lessonId,
                };
            }));
            return {
                ...mod.toObject(),
                lessons: lessonsWithStatus,
            };
        }));
        const currentProgress = await progress_schema_1.Progress.findOne({ user: userId, lesson: lessonId });
        (0, sendResponse_1.sendResponse)(res, 200, {
            lesson: lesson.toObject(),
            resources,
            sidebar,
            progress: {
                completed: currentProgress?.completed || false,
                lastWatched: currentProgress?.lastWatched || null,
                flaggedVideo: currentProgress?.flaggedVideo || false,
            },
        });
    }
    catch (err) {
        console.error('[GetLessonDetail Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.getLessonDetail = getLessonDetail;
const completeLesson = async (req, res) => {
    try {
        const { courseId, lessonId } = req.params;
        const userId = new mongoose_1.default.Types.ObjectId(req.user._id);
        const existingProgress = await progress_schema_1.Progress.findOne({ user: userId, lesson: lessonId });
        const isFirstCompletion = !existingProgress?.completed;
        const progress = await progress_schema_1.Progress.findOneAndUpdate({ user: userId, course: courseId, lesson: lessonId }, { $set: { completed: true, completedAt: new Date(), lastWatched: new Date() } }, { upsert: true, new: true });
        if (isFirstCompletion) {
            await activity_log_schema_1.ActivityLog.create({
                user: userId,
                lesson: new mongoose_1.default.Types.ObjectId(lessonId),
                course: new mongoose_1.default.Types.ObjectId(courseId),
                action: 'completed',
            });
        }
        const totalPublished = await lesson_schema_1.Lesson.countDocuments({ course: courseId, status: 'published' });
        const completedCount = await progress_schema_1.Progress.countDocuments({
            user: userId,
            course: courseId,
            completed: true,
        });
        const courseProgressPercent = totalPublished > 0 ? Math.round((completedCount / totalPublished) * 100) : 0;
        (0, sendResponse_1.sendResponse)(res, 200, {
            completed: true,
            completedAt: progress.completedAt,
            courseProgressPercent,
        });
    }
    catch (err) {
        console.error('[CompleteLesson Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.completeLesson = completeLesson;
const flagVideo = async (req, res) => {
    try {
        const { courseId, lessonId } = req.params;
        const userId = new mongoose_1.default.Types.ObjectId(req.user._id);
        await progress_schema_1.Progress.findOneAndUpdate({ user: userId, course: courseId, lesson: lessonId }, { $set: { flaggedVideo: true } }, { upsert: true, new: true });
        (0, sendResponse_1.sendResponse)(res, 200, { flagged: true });
    }
    catch (err) {
        console.error('[FlagVideo Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.flagVideo = flagVideo;
const getStudentResources = async (req, res) => {
    try {
        const resources = await lesson_resource_schema_1.LessonResource.find({ status: 'published' })
            .populate({ path: 'course', select: 'title thumbnail' })
            .populate({ path: 'lesson', select: 'title' })
            .sort({ course: 1, order: 1 });
        const result = resources.map((r) => {
            const obj = r.toObject();
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
        (0, sendResponse_1.sendResponse)(res, 200, { resources: result });
    }
    catch (err) {
        console.error('[GetStudentResources Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.getStudentResources = getStudentResources;
//# sourceMappingURL=courses.controller.js.map