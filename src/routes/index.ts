import { Router } from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';
import { maintenanceMiddleware } from '../middleware/maintenance.middleware';

import authRoutes from './auth.routes';

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

// Student routes
import studentDashboardRoutes from './student/dashboard.routes';
import studentCoursesRoutes from './student/courses.routes';
import studentResourcesRoutes from './student/resources.routes';
import studentRecordingsRoutes from './student/recordings.routes';
import studentLabsRoutes from './student/labs.routes';
import studentNotificationsRoutes from './student/notifications.routes';
import studentSettingsRoutes from './student/settings.routes';
import { getMe } from '../controllers/student/profile.controller';

const router = Router();

// ─── Auth ────────────────────────────────────────────────────────────────────
router.use('/auth', authRoutes);

// ─── Admin ───────────────────────────────────────────────────────────────────
const adminRouter = Router();
adminRouter.use(authenticate, requireAdmin);

adminRouter.use('/dashboard', adminDashboardRoutes);
adminRouter.use('/users', adminUsersRoutes);
adminRouter.use('/courses', adminCoursesRoutes);
adminRouter.use('/lessons', adminLessonsRoutes);
adminRouter.use('/resources', adminResourcesRoutes);
adminRouter.use('/instructors', adminInstructorsRoutes);
adminRouter.use('/recordings', adminRecordingsRoutes);
adminRouter.use('/labs', adminLabsRoutes);
adminRouter.use('/lab-applications', adminLabApplicationsRoutes);
adminRouter.use('/banners', adminBannersRoutes);
adminRouter.use('/notifications', adminNotificationsRoutes);
adminRouter.use('/settings', adminSettingsRoutes);

router.use('/admin', adminRouter);

// ─── Student ─────────────────────────────────────────────────────────────────
const studentRouter = Router();
studentRouter.use(authenticate, maintenanceMiddleware);

studentRouter.get('/me', getMe);
studentRouter.use('/dashboard', studentDashboardRoutes);
studentRouter.use('/courses', studentCoursesRoutes);
studentRouter.use('/resources', studentResourcesRoutes);
studentRouter.use('/recordings', studentRecordingsRoutes);
studentRouter.use('/labs', studentLabsRoutes);
studentRouter.use('/notifications', studentNotificationsRoutes);
studentRouter.use('/settings', studentSettingsRoutes);

router.use('/student', studentRouter);

export default router;
