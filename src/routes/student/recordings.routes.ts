import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { maintenanceMiddleware } from '../../middleware/maintenance.middleware';
import { ROLES } from '../../constants/roles';
import {
  getRecordingCategories,
  getRecording,
} from '../../controllers/student/recordings.controller';

const router = Router();

router.get('/', authenticate(ROLES.STUDENT), maintenanceMiddleware, getRecordingCategories);
router.get('/:id', authenticate(ROLES.STUDENT), maintenanceMiddleware, getRecording);

export default router;
