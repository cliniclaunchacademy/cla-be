import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { maintenanceMiddleware } from '../../middleware/maintenance.middleware';
import { ROLES } from '../../constants/roles';
import {
  getDashboardStats,
  getContinueLearning,
  getDashboardBanners,
  getCommunityBanner,
  getRecentActivity,
  getWatchTime,
} from '../../controllers/student/dashboard.controller';

const router = Router();

router.get('/stats', authenticate(ROLES.STUDENT), maintenanceMiddleware, getDashboardStats);
router.get('/continue-learning', authenticate(ROLES.STUDENT), maintenanceMiddleware, getContinueLearning);
router.get('/banners', authenticate(ROLES.STUDENT), maintenanceMiddleware, getDashboardBanners);
router.get('/community-banner', authenticate(ROLES.STUDENT), maintenanceMiddleware, getCommunityBanner);
router.get('/recent-activity', authenticate(ROLES.STUDENT), maintenanceMiddleware, getRecentActivity);
router.get('/watch-time', authenticate(ROLES.STUDENT), maintenanceMiddleware, getWatchTime);

export default router;
