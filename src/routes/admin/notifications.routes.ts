import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { ROLES } from '../../constants/roles';
import {
  sendNotification,
  deleteNotification,
} from '../../controllers/admin/notifications.controller';

const router = Router();

router.post('/', authenticate(ROLES.ADMIN), sendNotification);
router.delete('/:notificationId', authenticate(ROLES.ADMIN), deleteNotification);

export default router;
