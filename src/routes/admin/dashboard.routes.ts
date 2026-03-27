import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { ROLES } from '../../constants/roles';
import {
  getDashboardStats,
  getRecentlyJoined,
  getNotificationHistory,
} from '../../controllers/admin/dashboard.controller';

const router = Router();

router.get('/stats', authenticate(ROLES.ADMIN), getDashboardStats);
router.get('/recently-joined', authenticate(ROLES.ADMIN), getRecentlyJoined);
router.get('/notification-history', authenticate(ROLES.ADMIN), getNotificationHistory);

export default router;
