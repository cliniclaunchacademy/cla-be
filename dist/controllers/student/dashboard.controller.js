"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecentActivity = exports.getCommunityBanner = exports.getDashboardBanners = exports.getContinueLearning = exports.getDashboardStats = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const lesson_schema_1 = require("../../models/lesson.schema");
const progress_schema_1 = require("../../models/progress.schema");
const activity_log_schema_1 = require("../../models/activity_log.schema");
const banner_schema_1 = require("../../models/banner.schema");
const admin_settings_schema_1 = require("../../models/admin_settings.schema");
const sendResponse_1 = require("../../utils/sendResponse");
const getDashboardStats = async (req, res) => {
    try {
        const userId = new mongoose_1.default.Types.ObjectId(req.user._id);
        const enrolledCourseIds = await progress_schema_1.Progress.distinct('course', { user: userId });
        const enrolled = enrolledCourseIds.length;
        let completedCourses = 0;
        for (const courseId of enrolledCourseIds) {
            const totalPublished = await lesson_schema_1.Lesson.countDocuments({ course: courseId, status: 'published' });
            if (totalPublished === 0)
                continue;
            const completedCount = await progress_schema_1.Progress.countDocuments({
                user: userId,
                course: courseId,
                completed: true,
            });
            if (completedCount >= totalPublished) {
                completedCourses++;
            }
        }
        const inProgress = enrolled - completedCourses;
        const lessonsCompleted = await progress_schema_1.Progress.countDocuments({ user: userId, completed: true });
        (0, sendResponse_1.sendResponse)(res, 200, {
            stats: {
                enrolled,
                completed: completedCourses,
                inProgress,
                lessonsCompleted,
            },
        });
    }
    catch (err) {
        console.error('[GetDashboardStats Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.getDashboardStats = getDashboardStats;
const getContinueLearning = async (req, res) => {
    try {
        const userId = new mongoose_1.default.Types.ObjectId(req.user._id);
        const progress = await progress_schema_1.Progress.findOne({ user: userId, lastWatched: { $exists: true, $ne: null } })
            .sort({ lastWatched: -1 })
            .populate({ path: 'lesson', select: 'title subheading order module' })
            .populate({ path: 'course', select: 'title thumbnail status' });
        if (!progress || !progress.lesson || !progress.course) {
            (0, sendResponse_1.sendResponse)(res, 200, { continueLearning: null });
            return;
        }
        const courseId = progress.course._id;
        const totalLessons = await lesson_schema_1.Lesson.countDocuments({ course: courseId, status: 'published' });
        const completedLessons = await progress_schema_1.Progress.countDocuments({ user: userId, course: courseId, completed: true });
        const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
        (0, sendResponse_1.sendResponse)(res, 200, {
            continueLearning: {
                lessonId: progress.lesson._id,
                lessonTitle: progress.lesson.title,
                courseId: progress.course._id,
                courseTitle: progress.course.title,
                courseThumbnail: progress.course.thumbnail,
                lastWatched: progress.lastWatched,
                completed: progress.completed,
                progressPercent,
                completedLessons,
                totalLessons,
            },
        });
    }
    catch (err) {
        console.error('[GetContinueLearning Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.getContinueLearning = getContinueLearning;
const getDashboardBanners = async (_req, res) => {
    try {
        const banners = await banner_schema_1.Banner.find({ status: 'active' }).sort({ order: 1 });
        (0, sendResponse_1.sendResponse)(res, 200, { banners });
    }
    catch (err) {
        console.error('[GetDashboardBanners Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.getDashboardBanners = getDashboardBanners;
const getCommunityBanner = async (_req, res) => {
    try {
        const settings = await admin_settings_schema_1.AdminSettings.findOne().lean();
        (0, sendResponse_1.sendResponse)(res, 200, { discordInviteUrl: settings?.discordInviteUrl || null });
    }
    catch (err) {
        console.error('[GetCommunityBanner Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.getCommunityBanner = getCommunityBanner;
const getRecentActivity = async (req, res) => {
    try {
        const userId = new mongoose_1.default.Types.ObjectId(req.user._id);
        const activities = await activity_log_schema_1.ActivityLog.find({
            user: userId,
            action: { $in: ['watched', 'completed'] },
        })
            .sort({ createdAt: -1 })
            .limit(10)
            .populate({ path: 'lesson', select: 'title' })
            .populate({ path: 'course', select: 'title' });
        (0, sendResponse_1.sendResponse)(res, 200, { activities });
    }
    catch (err) {
        console.error('[GetRecentActivity Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.getRecentActivity = getRecentActivity;
//# sourceMappingURL=dashboard.controller.js.map