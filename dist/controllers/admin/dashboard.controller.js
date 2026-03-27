"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNotificationHistory = exports.getRecentlyJoined = exports.getDashboardStats = void 0;
const user_schema_1 = require("../../models/user.schema");
const progress_schema_1 = require("../../models/progress.schema");
const activity_log_schema_1 = require("../../models/activity_log.schema");
const notification_schema_1 = require("../../models/notification.schema");
const sendResponse_1 = require("../../utils/sendResponse");
const getDashboardStats = async (_req, res) => {
    try {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const activeLearnersResult = await activity_log_schema_1.ActivityLog.distinct('user', {
            createdAt: { $gte: thirtyDaysAgo },
        });
        const activeLearnersLast30Days = activeLearnersResult.length;
        const newUsersThisWeek = await user_schema_1.User.countDocuments({
            createdAt: { $gte: sevenDaysAgo },
        });
        const totalLessonsCompleted = await progress_schema_1.Progress.countDocuments({ completed: true });
        (0, sendResponse_1.sendResponse)(res, 200, {
            stats: {
                activeLearnersLast30Days,
                newUsersThisWeek,
                totalLessonsCompleted,
            },
        });
    }
    catch (err) {
        console.error('[AdminDashboardStats Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.getDashboardStats = getDashboardStats;
const getRecentlyJoined = async (_req, res) => {
    try {
        const users = await user_schema_1.User.find({ role: 'student' })
            .sort({ createdAt: -1 })
            .limit(10)
            .select('-password -resetToken -resetTokenExpiry');
        (0, sendResponse_1.sendResponse)(res, 200, { users });
    }
    catch (err) {
        console.error('[AdminRecentlyJoined Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.getRecentlyJoined = getRecentlyJoined;
const getNotificationHistory = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        const [notifications, total] = await Promise.all([
            notification_schema_1.Notification.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate({ path: 'createdBy', select: 'firstName lastName email' }),
            notification_schema_1.Notification.countDocuments(),
        ]);
        (0, sendResponse_1.sendResponse)(res, 200, {
            notifications,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    }
    catch (err) {
        console.error('[AdminNotificationHistory Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.getNotificationHistory = getNotificationHistory;
//# sourceMappingURL=dashboard.controller.js.map