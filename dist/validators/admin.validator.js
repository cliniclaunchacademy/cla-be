"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveSettingsSchema = exports.sendNotificationSchema = exports.updateBannerSchema = exports.uploadBannerSchema = exports.updateApplicationStatusSchema = exports.updateLabSchema = exports.createLabSchema = exports.updateRecordingSchema = exports.createRecordingSchema = exports.updateRecordingCategorySchema = exports.createRecordingCategorySchema = exports.updateInstructorSchema = exports.createInstructorSchema = exports.updateResourceSchema = exports.addResourceSchema = exports.updateLessonSchema = exports.createLessonSchema = exports.updateModuleSchema = exports.createModuleSchema = exports.reorderSchema = exports.updateCourseSchema = exports.createCourseSchema = exports.editUserSchema = exports.createUserSchema = exports.updateAdminProfileSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.updateAdminProfileSchema = joi_1.default.object({
    firstName: joi_1.default.string().trim().optional(),
    lastName: joi_1.default.string().trim().optional(),
    username: joi_1.default.string().trim().optional(),
});
exports.createUserSchema = joi_1.default.object({
    username: joi_1.default.string().trim().required(),
    email: joi_1.default.string().email().required(),
    firstName: joi_1.default.string().trim().required(),
    lastName: joi_1.default.string().trim().required(),
    password: joi_1.default.string().min(8).required(),
    role: joi_1.default.string().valid('student', 'admin').required(),
    sendWelcomeEmail: joi_1.default.boolean().optional(),
});
exports.editUserSchema = joi_1.default.object({
    username: joi_1.default.string().trim().optional(),
    firstName: joi_1.default.string().trim().optional(),
    lastName: joi_1.default.string().trim().optional(),
    email: joi_1.default.string().email().optional(),
    role: joi_1.default.string().valid('student', 'admin').optional(),
    password: joi_1.default.string().min(8).optional(),
    status: joi_1.default.string().valid('active', 'banned', 'inactive').optional(),
});
exports.createCourseSchema = joi_1.default.object({
    title: joi_1.default.string().trim().required(),
    subheading: joi_1.default.string().trim().optional().allow(''),
    about: joi_1.default.string().optional().allow(''),
    instructorId: joi_1.default.string().required(),
    status: joi_1.default.string().valid('draft', 'unpublished', 'published').required(),
    comingSoon: joi_1.default.boolean().optional(),
    releaseDate: joi_1.default.date().optional(),
    banner: joi_1.default.string().optional().allow(''),
});
exports.updateCourseSchema = joi_1.default.object({
    title: joi_1.default.string().trim().optional(),
    subheading: joi_1.default.string().trim().optional().allow(''),
    about: joi_1.default.string().optional().allow(''),
    instructorId: joi_1.default.string().optional(),
    status: joi_1.default.string().valid('draft', 'unpublished', 'published').optional(),
    comingSoon: joi_1.default.boolean().optional(),
    releaseDate: joi_1.default.date().optional().allow(null),
    banner: joi_1.default.string().optional().allow(''),
});
exports.reorderSchema = joi_1.default.object({
    order: joi_1.default.array().items(joi_1.default.string()).required(),
});
exports.createModuleSchema = joi_1.default.object({
    title: joi_1.default.string().trim().required(),
});
exports.updateModuleSchema = joi_1.default.object({
    title: joi_1.default.string().trim().required(),
});
exports.createLessonSchema = joi_1.default.object({
    title: joi_1.default.string().trim().required(),
    subheading: joi_1.default.string().trim().optional().allow(''),
    videoEmbed: joi_1.default.string().optional().allow(''),
    status: joi_1.default.string().valid('draft', 'published').required(),
    comingSoon: joi_1.default.boolean().optional(),
    releaseDate: joi_1.default.date().optional().allow(null),
});
exports.updateLessonSchema = joi_1.default.object({
    title: joi_1.default.string().trim().optional(),
    subheading: joi_1.default.string().trim().optional().allow(''),
    videoEmbed: joi_1.default.string().optional().allow(''),
    status: joi_1.default.string().valid('draft', 'published').optional(),
    comingSoon: joi_1.default.boolean().optional(),
    releaseDate: joi_1.default.date().optional().allow(null),
});
exports.addResourceSchema = joi_1.default.object({
    title: joi_1.default.string().trim().required(),
    type: joi_1.default.string().valid('file', 'link', 'pdf', 'video').required(),
    url: joi_1.default.string().optional().allow(''),
    description: joi_1.default.string().optional().allow(''),
    status: joi_1.default.string().valid('published', 'hidden').required(),
});
exports.updateResourceSchema = joi_1.default.object({
    title: joi_1.default.string().trim().optional(),
    status: joi_1.default.string().valid('published', 'hidden').optional(),
    description: joi_1.default.string().optional().allow(''),
    url: joi_1.default.string().optional(),
    type: joi_1.default.string().valid('file', 'link', 'pdf', 'video').optional(),
});
exports.createInstructorSchema = joi_1.default.object({
    firstName: joi_1.default.string().trim().required(),
    lastName: joi_1.default.string().trim().required(),
    title: joi_1.default.string().trim().required(),
    bio: joi_1.default.string().optional().allow(''),
    status: joi_1.default.string().valid('active', 'inactive').required(),
});
exports.updateInstructorSchema = joi_1.default.object({
    firstName: joi_1.default.string().trim().optional(),
    lastName: joi_1.default.string().trim().optional(),
    title: joi_1.default.string().trim().optional(),
    bio: joi_1.default.string().optional().allow(''),
    status: joi_1.default.string().valid('active', 'inactive').optional(),
});
exports.createRecordingCategorySchema = joi_1.default.object({
    name: joi_1.default.string().trim().required(),
    status: joi_1.default.string().valid('published', 'hidden').required(),
});
exports.updateRecordingCategorySchema = joi_1.default.object({
    name: joi_1.default.string().trim().optional(),
    status: joi_1.default.string().valid('published', 'hidden').optional(),
});
exports.createRecordingSchema = joi_1.default.object({
    title: joi_1.default.string().trim().required(),
    subheading: joi_1.default.string().trim().optional().allow(''),
    videoEmbed: joi_1.default.string().required(),
    recordedDate: joi_1.default.date().optional().allow(null),
    status: joi_1.default.string().valid('published', 'hidden').required(),
});
exports.updateRecordingSchema = joi_1.default.object({
    title: joi_1.default.string().trim().optional(),
    subheading: joi_1.default.string().trim().optional().allow(''),
    videoEmbed: joi_1.default.string().optional(),
    recordedDate: joi_1.default.date().optional().allow(null),
    status: joi_1.default.string().valid('published', 'hidden').optional(),
});
exports.createLabSchema = joi_1.default.object({
    name: joi_1.default.string().trim().required(),
    subheading: joi_1.default.string().trim().optional().allow(''),
    portalUrl: joi_1.default.string().optional().allow(''),
    applicationEmbed: joi_1.default.string().optional().allow(''),
    status: joi_1.default.string().valid('live', 'coming_soon', 'maintenance').required(),
    releaseDate: joi_1.default.date().optional().allow(null),
    maintenanceMsg: joi_1.default.string().optional().allow(''),
});
exports.updateLabSchema = joi_1.default.object({
    name: joi_1.default.string().trim().optional(),
    subheading: joi_1.default.string().trim().optional().allow(''),
    portalUrl: joi_1.default.string().optional().allow(''),
    applicationEmbed: joi_1.default.string().optional().allow(''),
    status: joi_1.default.string().valid('live', 'coming_soon', 'maintenance').optional(),
    releaseDate: joi_1.default.date().optional().allow(null),
    maintenanceMsg: joi_1.default.string().optional().allow(''),
});
exports.updateApplicationStatusSchema = joi_1.default.object({
    status: joi_1.default.string().valid('pending', 'verified', 'rejected').required(),
    rejectionReason: joi_1.default.string().optional().allow(''),
});
exports.uploadBannerSchema = joi_1.default.object({
    label: joi_1.default.string().trim().required(),
});
exports.updateBannerSchema = joi_1.default.object({
    label: joi_1.default.string().trim().optional(),
    status: joi_1.default.string().valid('active', 'inactive').optional(),
});
exports.sendNotificationSchema = joi_1.default.object({
    title: joi_1.default.string().trim().required(),
    message: joi_1.default.string().required(),
    type: joi_1.default.string()
        .valid('new_course', 'new_lesson', 'system_alert', 'reminder', 'achievement', 'welcome', 'custom')
        .required(),
    targetType: joi_1.default.string().valid('all', 'user', 'role').required(),
    targetUsers: joi_1.default.array().items(joi_1.default.string()).optional(),
    targetRole: joi_1.default.string().valid('student', 'admin').optional(),
});
exports.saveSettingsSchema = joi_1.default.object({
    discordInviteUrl: joi_1.default.string().optional().allow(''),
    supportEmail: joi_1.default.string().email().optional().allow(''),
    maintenanceMode: joi_1.default.boolean().optional(),
    maintenanceMessage: joi_1.default.string().optional().allow(''),
});
//# sourceMappingURL=admin.validator.js.map