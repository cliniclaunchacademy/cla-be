import { Router } from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';

// Controllers
import {
  getDashboardStats,
  getRecentlyJoined,
  getNotificationHistory,
} from '../controllers/admin/dashboard.controller';

import {
  getUsers,
  createUser,
  updateUser,
  banUser,
  unbanUser,
  resendWelcomeEmail,
  deleteUser,
} from '../controllers/admin/users.controller';

import {
  getCourses,
  createCourse,
  uploadCourseThumbnail,
  updateCourse,
  reorderCourses,
  deleteCourse,
  getCourseEditor,
  createModule,
  updateModule,
  reorderModules,
  deleteModule,
  createLesson,
  updateLesson,
  reorderLessons,
  deleteLesson,
} from '../controllers/admin/courses.controller';

import {
  addResource,
  updateResource,
  deleteResource,
  reorderResources,
  getAllResources,
  getResourcesByCourse,
} from '../controllers/admin/resources.controller';

import {
  getInstructors,
  createInstructor,
  uploadInstructorPhoto,
  updateInstructor,
  deleteInstructor,
} from '../controllers/admin/instructors.controller';

import {
  getRecordingCategories,
  createRecordingCategory,
  updateRecordingCategory,
  deleteRecordingCategory,
  reorderRecordingCategories,
  getRecordings,
  createRecording,
  updateRecording,
  deleteRecording,
  reorderRecordings,
} from '../controllers/admin/recordings.controller';

import {
  getLabs,
  createLab,
  uploadLabLogo,
  updateLab,
  deleteLab,
  reorderLabs,
  getLabApplications,
  getLabApplicationDetail,
  updateApplicationStatus,
} from '../controllers/admin/labs.controller';

import {
  getBanners,
  createBanner,
  updateBanner,
  reorderBanners,
  deleteBanner,
} from '../controllers/admin/banners.controller';

import {
  sendNotification,
  deleteNotification,
} from '../controllers/admin/notifications.controller';

import { getSettings, saveSettings } from '../controllers/admin/settings.controller';

import { imageUpload } from '../utils/upload';

const router = Router();

// Apply auth + admin middleware to all admin routes
router.use(authenticate);
router.use(requireAdmin);

// Dashboard
router.get('/dashboard/stats', getDashboardStats);
router.get('/dashboard/recently-joined', getRecentlyJoined);
router.get('/dashboard/notification-history', getNotificationHistory);

// Users
router.get('/users', getUsers);
router.post('/users', createUser);
router.put('/users/:userId', updateUser);
router.patch('/users/:userId/ban', banUser);
router.patch('/users/:userId/unban', unbanUser);
router.post('/users/:userId/resend-email', resendWelcomeEmail);
router.delete('/users/:userId', deleteUser);

// Courses — reorder BEFORE :courseId to avoid param conflicts
router.get('/courses', getCourses);
router.post('/courses', createCourse);
router.patch('/courses/reorder', reorderCourses);
router.get('/courses/:courseId/editor', getCourseEditor);
router.post('/courses/:courseId/thumbnail', imageUpload.single('thumbnail'), uploadCourseThumbnail);
router.put('/courses/:courseId', updateCourse);
router.delete('/courses/:courseId', deleteCourse);

// Modules — reorder BEFORE :moduleId
router.post('/courses/:courseId/modules', createModule);
router.patch('/courses/:courseId/modules/reorder', reorderModules);
router.put('/courses/:courseId/modules/:moduleId', updateModule);
router.delete('/courses/:courseId/modules/:moduleId', deleteModule);

// Lessons — reorder BEFORE :lessonId
router.post('/courses/:courseId/modules/:moduleId/lessons', createLesson);
router.patch('/courses/:courseId/modules/:moduleId/lessons/reorder', reorderLessons);
router.put('/courses/:courseId/modules/:moduleId/lessons/:lessonId', updateLesson);
router.delete('/courses/:courseId/modules/:moduleId/lessons/:lessonId', deleteLesson);

// Resources
router.post('/lessons/:lessonId/resources', addResource);
router.patch('/lessons/:lessonId/resources/reorder', reorderResources);
router.put('/lessons/:lessonId/resources/:resourceId', updateResource);
router.delete('/lessons/:lessonId/resources/:resourceId', deleteResource);

// Admin Resources view
router.get('/resources', getAllResources);
router.get('/resources/:courseId', getResourcesByCourse);

// Instructors
router.get('/instructors', getInstructors);
router.post('/instructors', createInstructor);
router.post('/instructors/:instructorId/photo', imageUpload.single('photo'), uploadInstructorPhoto);
router.put('/instructors/:instructorId', updateInstructor);
router.delete('/instructors/:instructorId', deleteInstructor);

// Recordings — reorder BEFORE :categoryId
router.get('/recordings', getRecordingCategories);
router.post('/recordings/categories', createRecordingCategory);
router.patch('/recordings/categories/reorder', reorderRecordingCategories);
router.get('/recordings/categories/:categoryId/recordings', getRecordings);
router.post('/recordings/categories/:categoryId/recordings', createRecording);
router.patch('/recordings/categories/:categoryId/recordings/reorder', reorderRecordings);
router.put('/recordings/categories/:categoryId', updateRecordingCategory);
router.delete('/recordings/categories/:categoryId', deleteRecordingCategory);
router.put('/recordings/:recordingId', updateRecording);
router.delete('/recordings/:recordingId', deleteRecording);

// Labs — reorder BEFORE :labId
router.get('/labs', getLabs);
router.post('/labs', createLab);
router.patch('/labs/reorder', reorderLabs);
router.post('/labs/:labId/logo', imageUpload.single('logo'), uploadLabLogo);
router.put('/labs/:labId', updateLab);
router.delete('/labs/:labId', deleteLab);

// Lab Applications
router.get('/lab-applications', getLabApplications);
router.get('/lab-applications/:applicationId', getLabApplicationDetail);
router.patch('/lab-applications/:applicationId/status', updateApplicationStatus);

// Banners — reorder BEFORE :bannerId
router.get('/banners', getBanners);
router.post('/banners', imageUpload.single('image'), createBanner);
router.patch('/banners/reorder', reorderBanners);
router.patch('/banners/:bannerId', updateBanner);
router.delete('/banners/:bannerId', deleteBanner);

// Notifications
router.post('/notifications', sendNotification);
router.delete('/notifications/:notificationId', deleteNotification);

// Settings
router.get('/settings', getSettings);
router.put('/settings', saveSettings);

export default router;
