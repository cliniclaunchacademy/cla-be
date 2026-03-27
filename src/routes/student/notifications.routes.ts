import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { maintenanceMiddleware } from '../../middleware/maintenance.middleware';
import { ROLES } from '../../constants/roles';
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from '../../controllers/student/notifications.controller';

const router = Router();

// read-all BEFORE :notificationId/read to avoid param conflict
router.get('/', authenticate(ROLES.STUDENT), maintenanceMiddleware, getNotifications);
router.patch('/read-all', authenticate(ROLES.STUDENT), maintenanceMiddleware, markAllNotificationsRead);
router.patch('/:notificationId/read', authenticate(ROLES.STUDENT), maintenanceMiddleware, markNotificationRead);

export default router;
