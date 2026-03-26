import Joi from 'joi';

export const createUserSchema = Joi.object({
  username: Joi.string().trim().required(),
  email: Joi.string().email().required(),
  firstName: Joi.string().trim().required(),
  lastName: Joi.string().trim().required(),
  password: Joi.string().min(8).required(),
  role: Joi.string().valid('student', 'admin').required(),
  sendWelcomeEmail: Joi.boolean().optional(),
});

export const editUserSchema = Joi.object({
  username: Joi.string().trim().optional(),
  firstName: Joi.string().trim().optional(),
  lastName: Joi.string().trim().optional(),
  email: Joi.string().email().optional(),
  role: Joi.string().valid('student', 'admin').optional(),
  password: Joi.string().min(8).optional(),
  status: Joi.string().valid('active', 'banned', 'inactive').optional(),
});

export const createCourseSchema = Joi.object({
  title: Joi.string().trim().required(),
  subheading: Joi.string().trim().optional().allow(''),
  about: Joi.string().optional().allow(''),
  instructorId: Joi.string().required(),
  status: Joi.string().valid('draft', 'unpublished', 'published').required(),
  comingSoon: Joi.boolean().optional(),
  releaseDate: Joi.date().optional(),
});

export const updateCourseSchema = Joi.object({
  title: Joi.string().trim().optional(),
  subheading: Joi.string().trim().optional().allow(''),
  about: Joi.string().optional().allow(''),
  instructorId: Joi.string().optional(),
  status: Joi.string().valid('draft', 'unpublished', 'published').optional(),
  comingSoon: Joi.boolean().optional(),
  releaseDate: Joi.date().optional().allow(null),
});

export const reorderSchema = Joi.object({
  order: Joi.array().items(Joi.string()).required(),
});

export const createModuleSchema = Joi.object({
  title: Joi.string().trim().required(),
});

export const updateModuleSchema = Joi.object({
  title: Joi.string().trim().required(),
});

export const createLessonSchema = Joi.object({
  title: Joi.string().trim().required(),
  subheading: Joi.string().trim().optional().allow(''),
  videoEmbed: Joi.string().optional().allow(''),
  status: Joi.string().valid('draft', 'published').required(),
  comingSoon: Joi.boolean().optional(),
  releaseDate: Joi.date().optional().allow(null),
});

export const updateLessonSchema = Joi.object({
  title: Joi.string().trim().optional(),
  subheading: Joi.string().trim().optional().allow(''),
  videoEmbed: Joi.string().optional().allow(''),
  status: Joi.string().valid('draft', 'published').optional(),
  comingSoon: Joi.boolean().optional(),
  releaseDate: Joi.date().optional().allow(null),
});

export const addResourceSchema = Joi.object({
  title: Joi.string().trim().required(),
  type: Joi.string().valid('file', 'link', 'pdf', 'video').required(),
  url: Joi.string().required(),
  description: Joi.string().optional().allow(''),
  status: Joi.string().valid('published', 'hidden').required(),
});

export const updateResourceSchema = Joi.object({
  title: Joi.string().trim().optional(),
  status: Joi.string().valid('published', 'hidden').optional(),
  description: Joi.string().optional().allow(''),
  url: Joi.string().optional(),
  type: Joi.string().valid('file', 'link', 'pdf', 'video').optional(),
});

export const createInstructorSchema = Joi.object({
  firstName: Joi.string().trim().required(),
  lastName: Joi.string().trim().required(),
  title: Joi.string().trim().required(),
  bio: Joi.string().optional().allow(''),
  status: Joi.string().valid('active', 'inactive').required(),
});

export const updateInstructorSchema = Joi.object({
  firstName: Joi.string().trim().optional(),
  lastName: Joi.string().trim().optional(),
  title: Joi.string().trim().optional(),
  bio: Joi.string().optional().allow(''),
  status: Joi.string().valid('active', 'inactive').optional(),
});

export const createRecordingCategorySchema = Joi.object({
  name: Joi.string().trim().required(),
  status: Joi.string().valid('published', 'hidden').required(),
});

export const updateRecordingCategorySchema = Joi.object({
  name: Joi.string().trim().optional(),
  status: Joi.string().valid('published', 'hidden').optional(),
});

export const createRecordingSchema = Joi.object({
  title: Joi.string().trim().required(),
  subheading: Joi.string().trim().optional().allow(''),
  videoEmbed: Joi.string().required(),
  recordedDate: Joi.date().optional().allow(null),
  status: Joi.string().valid('published', 'hidden').required(),
});

export const updateRecordingSchema = Joi.object({
  title: Joi.string().trim().optional(),
  subheading: Joi.string().trim().optional().allow(''),
  videoEmbed: Joi.string().optional(),
  recordedDate: Joi.date().optional().allow(null),
  status: Joi.string().valid('published', 'hidden').optional(),
});

export const createLabSchema = Joi.object({
  name: Joi.string().trim().required(),
  subheading: Joi.string().trim().optional().allow(''),
  portalUrl: Joi.string().optional().allow(''),
  applicationEmbed: Joi.string().optional().allow(''),
  status: Joi.string().valid('live', 'coming_soon', 'maintenance').required(),
  releaseDate: Joi.date().optional().allow(null),
  maintenanceMsg: Joi.string().optional().allow(''),
});

export const updateLabSchema = Joi.object({
  name: Joi.string().trim().optional(),
  subheading: Joi.string().trim().optional().allow(''),
  portalUrl: Joi.string().optional().allow(''),
  applicationEmbed: Joi.string().optional().allow(''),
  status: Joi.string().valid('live', 'coming_soon', 'maintenance').optional(),
  releaseDate: Joi.date().optional().allow(null),
  maintenanceMsg: Joi.string().optional().allow(''),
});

export const updateApplicationStatusSchema = Joi.object({
  status: Joi.string().valid('pending', 'verified', 'rejected').required(),
  rejectionReason: Joi.string().optional().allow(''),
});

export const uploadBannerSchema = Joi.object({
  label: Joi.string().trim().required(),
});

export const updateBannerSchema = Joi.object({
  label: Joi.string().trim().optional(),
  status: Joi.string().valid('active', 'inactive').optional(),
});

export const sendNotificationSchema = Joi.object({
  title: Joi.string().trim().required(),
  message: Joi.string().required(),
  type: Joi.string()
    .valid('new_course', 'new_lesson', 'system_alert', 'reminder', 'achievement', 'welcome', 'custom')
    .required(),
  targetType: Joi.string().valid('all', 'user', 'role').required(),
  targetUsers: Joi.array().items(Joi.string()).optional(),
  targetRole: Joi.string().valid('student', 'admin').optional(),
});

export const saveSettingsSchema = Joi.object({
  discordInviteUrl: Joi.string().optional().allow(''),
  supportEmail: Joi.string().email().optional().allow(''),
  maintenanceMode: Joi.boolean().optional(),
  maintenanceMessage: Joi.string().optional().allow(''),
});
