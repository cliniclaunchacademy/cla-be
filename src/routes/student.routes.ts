import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { maintenanceMiddleware } from '../middleware/maintenance.middleware';

// Controllers
import { getMe, updateProfile, uploadProfilePhoto } from '../controllers/student/profile.controller';
import {
  getDashboardStats,
  getContinueLearning,
  getDashboardBanners,
  getCommunityBanner,
  getRecentActivity,
} from '../controllers/student/dashboard.controller';
import {
  getCourses,
  getCourseDetail,
  getLessonDetail,
  completeLesson,
  flagVideo,
  getStudentResources,
} from '../controllers/student/courses.controller';
import {
  getRecordingCategories,
  getRecordingsByCategory,
} from '../controllers/student/recordings.controller';
import { getLabs, applyToLab } from '../controllers/student/labs.controller';
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from '../controllers/student/notifications.controller';

import { imageUpload } from '../utils/upload';

const router = Router();

// Apply auth + maintenance middleware to all student routes
router.use(authenticate);
router.use(maintenanceMiddleware);

// Profile
router.get('/me', getMe);
router.patch('/settings/profile', updateProfile);
router.post('/settings/photo', imageUpload.single('photo'), uploadProfilePhoto);

// Dashboard
router.get('/dashboard/stats', getDashboardStats);
router.get('/dashboard/continue-learning', getContinueLearning);
router.get('/dashboard/banners', getDashboardBanners);
router.get('/dashboard/community-banner', getCommunityBanner);
router.get('/dashboard/recent-activity', getRecentActivity);

// Courses
router.get('/courses', getCourses);
router.get('/courses/:courseId', getCourseDetail);
router.get('/courses/:courseId/lessons/:lessonId', getLessonDetail);
router.post('/courses/:courseId/lessons/:lessonId/complete', completeLesson);
router.post('/courses/:courseId/lessons/:lessonId/flag-video', flagVideo);

// Resources
router.get('/resources', getStudentResources);

// Recordings
router.get('/recordings', getRecordingCategories);
router.get('/recordings/:categoryId', getRecordingsByCategory);

// Labs
router.get('/labs', getLabs);
router.post('/labs/:labId/apply', applyToLab);

// Notifications — IMPORTANT: read-all must come before :notificationId/read
router.get('/notifications', getNotifications);
router.patch('/notifications/read-all', markAllNotificationsRead);
router.patch('/notifications/:notificationId/read', markNotificationRead);

export default router;
