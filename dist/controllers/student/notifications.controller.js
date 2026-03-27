"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAllNotificationsRead = exports.markNotificationRead = exports.getNotifications = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const notification_read_schema_1 = require("../../models/notification_read.schema");
const sendResponse_1 = require("../../utils/sendResponse");
const getNotifications = async (req, res) => {
    try {
        const userId = new mongoose_1.default.Types.ObjectId(req.user._id);
        const notificationReads = await notification_read_schema_1.NotificationRead.find({ user: userId })
            .sort({ createdAt: -1 })
            .limit(20)
            .populate({
            path: 'notification',
            select: 'title message type sentAt createdAt',
        });
        const unreadCount = await notification_read_schema_1.NotificationRead.countDocuments({ user: userId, read: false });
        const notifications = notificationReads.map((nr) => ({
            _id: nr._id,
            notification: nr.notification,
            read: nr.read,
            readAt: nr.readAt,
            createdAt: nr.createdAt,
        }));
        (0, sendResponse_1.sendResponse)(res, 200, { unreadCount, notifications });
    }
    catch (err) {
        console.error('[GetNotifications Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.getNotifications = getNotifications;
const markNotificationRead = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const userId = new mongoose_1.default.Types.ObjectId(req.user._id);
        const notificationRead = await notification_read_schema_1.NotificationRead.findOneAndUpdate({ notification: notificationId, user: userId }, { $set: { read: true, readAt: new Date() } }, { new: true });
        if (!notificationRead) {
            (0, sendResponse_1.sendResponse)(res, 404, { error: 'Notification not found.' });
            return;
        }
        (0, sendResponse_1.sendResponse)(res, 200, { read: true, readAt: notificationRead.readAt });
    }
    catch (err) {
        console.error('[MarkNotificationRead Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.markNotificationRead = markNotificationRead;
const markAllNotificationsRead = async (req, res) => {
    try {
        const userId = new mongoose_1.default.Types.ObjectId(req.user._id);
        const result = await notification_read_schema_1.NotificationRead.updateMany({ user: userId, read: false }, { $set: { read: true, readAt: new Date() } });
        (0, sendResponse_1.sendResponse)(res, 200, { updatedCount: result.modifiedCount });
    }
    catch (err) {
        console.error('[MarkAllNotificationsRead Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.markAllNotificationsRead = markAllNotificationsRead;
//# sourceMappingURL=notifications.controller.js.map