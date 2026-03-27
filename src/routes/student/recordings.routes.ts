import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { maintenanceMiddleware } from '../../middleware/maintenance.middleware';
import { ROLES } from '../../constants/roles';
import {
  getRecordingCategories,
  getRecordingsByCategory,
} from '../../controllers/student/recordings.controller';

const router = Router();

router.get('/', authenticate(ROLES.STUDENT), maintenanceMiddleware, getRecordingCategories);
router.get('/:categoryId', authenticate(ROLES.STUDENT), maintenanceMiddleware, getRecordingsByCategory);

export default router;
