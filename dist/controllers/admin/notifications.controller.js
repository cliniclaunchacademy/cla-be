"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNotification = exports.sendNotification = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const user_schema_1 = require("../../models/user.schema");
const notification_schema_1 = require("../../models/notification.schema");
const notification_read_schema_1 = require("../../models/notification_read.schema");
const sendResponse_1 = require("../../utils/sendResponse");
const admin_validator_1 = require("../../validators/admin.validator");
const sendNotification = async (req, res) => {
    try {
        const { error, value } = admin_validator_1.sendNotificationSchema.validate(req.body);
        if (error) {
            (0, sendResponse_1.sendResponse)(res, 400, { error: error.details[0].message });
            return;
        }
        const { title, message, type, targetType, targetUsers, targetRole } = value;
        const adminId = new mongoose_1.default.Types.ObjectId(req.user._id);
        let targetUserIds = [];
        if (targetType === 'all') {
            const users = await user_schema_1.User.find({ role: 'student' }).select('_id');
            targetUserIds = users.map((u) => u._id);
        }
        else if (targetType === 'role' && targetRole) {
            const users = await user_schema_1.User.find({ role: targetRole }).select('_id');
            targetUserIds = users.map((u) => u._id);
        }
        else if (targetType === 'user' && targetUsers && targetUsers.length > 0) {
            targetUserIds = targetUsers.map((id) => new mongoose_1.default.Types.ObjectId(id));
        }
        const notification = await notification_schema_1.Notification.create({
            title,
            message,
            type,
            targetType,
            targetUsers: targetType === 'user' ? targetUserIds : undefined,
            targetRole: targetType === 'role' ? targetRole : undefined,
            status: 'sent',
            sentAt: new Date(),
            createdBy: adminId,
        });
        if (targetUserIds.length > 0) {
            const reads = targetUserIds.map((userId) => ({
                notification: notification._id,
                user: userId,
                read: false,
            }));
            await notification_read_schema_1.NotificationRead.insertMany(reads, { ordered: false });
        }
        (0, sendResponse_1.sendResponse)(res, 201, {
            notification,
            recipientCount: targetUserIds.length,
            message: 'Notification sent successfully.',
        });
    }
    catch (err) {
        console.error('[AdminSendNotification Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.sendNotification = sendNotification;
const deleteNotification = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const notification = await notification_schema_1.Notification.findById(notificationId);
        if (!notification) {
            (0, sendResponse_1.sendResponse)(res, 404, { error: 'Notification not found.' });
            return;
        }
        await Promise.all([
            notification_read_schema_1.NotificationRead.deleteMany({ notification: notificationId }),
            notification_schema_1.Notification.findByIdAndDelete(notificationId),
        ]);
        (0, sendResponse_1.sendResponse)(res, 200, { message: 'Notification deleted.' });
    }
    catch (err) {
        console.error('[AdminDeleteNotification Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.deleteNotification = deleteNotification;
//# sourceMappingURL=notifications.controller.js.map