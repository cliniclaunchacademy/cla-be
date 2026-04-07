import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { ROLES } from '../../constants/roles';
import {
  sendNotification,
  cancelNotification,
  resendNotification,
  deleteNotification,
} from '../../controllers/admin/notifications.controller';

const router = Router();

router.post('/', authenticate(ROLES.ADMIN), sendNotification);
router.patch('/:notificationId/cancel', authenticate(ROLES.ADMIN), cancelNotification);
router.post('/:notificationId/resend', authenticate(ROLES.ADMIN), resendNotification);
router.delete('/:notificationId', authenticate(ROLES.ADMIN), deleteNotification);

export default router;
