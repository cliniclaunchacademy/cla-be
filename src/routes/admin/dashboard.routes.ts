import { Router } from 'express';
import {
  getDashboardStats,
  getRecentlyJoined,
  getNotificationHistory,
} from '../../controllers/admin/dashboard.controller';

const router = Router();

router.get('/stats', getDashboardStats);
router.get('/recently-joined', getRecentlyJoined);
router.get('/notification-history', getNotificationHistory);

export default router;
