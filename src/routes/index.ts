import { Router } from 'express';

import authRoutes from './auth.routes';
import ghlWebhookRoutes from './webhooks/ghl.routes';

// Admin routes
import adminDashboardRoutes from './admin/dashboard.routes';
import adminUsersRoutes from './admin/users.routes';
import adminCoursesRoutes from './admin/courses.routes';
import adminLessonsRoutes from './admin/lessons.routes';
import adminResourcesRoutes from './admin/resources.routes';
import adminInstructorsRoutes from './admin/instructors.routes';
import adminRecordingsRoutes from './admin/recordings.routes';
import adminLabsRoutes from './admin/labs.routes';
import adminLabApplicationsRoutes from './admin/lab-applications.routes';
import adminBannersRoutes from './admin/banners.routes';
import adminNotificationsRoutes from './admin/notifications.routes';
import adminSettingsRoutes from './admin/settings.routes';
import adminProfileRoutes from './admin/profile.routes';
import adminCommunityRoutes from './admin/community.routes';

// Student routes
import studentProfileRoutes from './student/profile.routes';
import studentDashboardRoutes from './student/dashboard.routes';
import studentCoursesRoutes from './student/courses.routes';
import studentResourcesRoutes from './student/resources.routes';
import studentRecordingsRoutes from './student/recordings.routes';
import studentLabsRoutes from './student/labs.routes';
import studentNotificationsRoutes from './student/notifications.routes';
import studentSettingsRoutes from './student/settings.routes';
import studentCommunityRoutes from './student/community.routes';

const router = Router();

// ─── Auth ─────────────────────────────────────────────────────────────────────
router.use('/auth', authRoutes);

// ─── Webhooks (no JWT — verified via header secret) ───────────────────────────
router.use('/webhooks/ghl', ghlWebhookRoutes);

// ─── Admin ────────────────────────────────────────────────────────────────────
router.use('/admin/dashboard', adminDashboardRoutes);
router.use('/admin/users', adminUsersRoutes);
router.use('/admin/courses', adminCoursesRoutes);
router.use('/admin/lessons', adminLessonsRoutes);
router.use('/admin/resources', adminResourcesRoutes);
router.use('/admin/instructors', adminInstructorsRoutes);
router.use('/admin/recordings', adminRecordingsRoutes);
router.use('/admin/labs', adminLabsRoutes);
router.use('/admin/lab-applications', adminLabApplicationsRoutes);
router.use('/admin/banners', adminBannersRoutes);
router.use('/admin/notifications', adminNotificationsRoutes);
router.use('/admin/settings', adminSettingsRoutes);
router.use('/admin', adminProfileRoutes);
router.use('/admin/community', adminCommunityRoutes);

// ─── Student ──────────────────────────────────────────────────────────────────
router.use('/student', studentProfileRoutes);
router.use('/student/dashboard', studentDashboardRoutes);
router.use('/student/courses', studentCoursesRoutes);
router.use('/student/resources', studentResourcesRoutes);
router.use('/student/recordings', studentRecordingsRoutes);
router.use('/student/labs', studentLabsRoutes);
router.use('/student/notifications', studentNotificationsRoutes);
router.use('/student/settings', studentSettingsRoutes);
router.use('/student/community', studentCommunityRoutes);

export default router;
