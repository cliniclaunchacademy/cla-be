import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { ROLES } from '../../constants/roles';
import {
  getDashboardStats,
  getRecentlyJoined,
  getNotificationHistory,
  getWeeklySignups,
  getPopularCourses,
  getActivityHeatmap,
  getAtRiskLearners,
  getUserOverview,
} from '../../controllers/admin/dashboard.controller';

const router = Router();

router.get('/stats', authenticate(ROLES.ADMIN), getDashboardStats);
router.get('/recently-joined', authenticate(ROLES.ADMIN), getRecentlyJoined);
router.get('/notification-history', authenticate(ROLES.ADMIN), getNotificationHistory);
router.get('/weekly-signups', authenticate(ROLES.ADMIN), getWeeklySignups);
router.get('/popular-courses', authenticate(ROLES.ADMIN), getPopularCourses);
router.get('/activity-heatmap', authenticate(ROLES.ADMIN), getActivityHeatmap);
router.get('/at-risk-learners', authenticate(ROLES.ADMIN), getAtRiskLearners);
router.get('/users/:userId/overview', authenticate(ROLES.ADMIN), getUserOverview);

export default router;
