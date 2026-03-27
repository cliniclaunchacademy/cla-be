import { Router } from 'express';
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from '../../controllers/student/notifications.controller';

const router = Router();

// read-all BEFORE :notificationId/read to avoid param conflict
router.get('/', getNotifications);
router.patch('/read-all', markAllNotificationsRead);
router.patch('/:notificationId/read', markNotificationRead);

export default router;
