import { Router } from 'express';
import {
  getDashboardStats,
  getContinueLearning,
  getDashboardBanners,
  getCommunityBanner,
  getRecentActivity,
} from '../../controllers/student/dashboard.controller';

const router = Router();

router.get('/stats', getDashboardStats);
router.get('/continue-learning', getContinueLearning);
router.get('/banners', getDashboardBanners);
router.get('/community-banner', getCommunityBanner);
router.get('/recent-activity', getRecentActivity);

export default router;
