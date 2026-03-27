import { Router } from 'express';
import {
  sendNotification,
  deleteNotification,
} from '../../controllers/admin/notifications.controller';

const router = Router();

router.post('/', sendNotification);
router.delete('/:notificationId', deleteNotification);

export default router;
