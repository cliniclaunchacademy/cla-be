import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { maintenanceMiddleware } from '../../middleware/maintenance.middleware';
import { ROLES } from '../../constants/roles';
import { getMe } from '../../controllers/student/profile.controller';

const router = Router();

router.get('/me', authenticate(ROLES.STUDENT), maintenanceMiddleware, getMe);

export default router;
