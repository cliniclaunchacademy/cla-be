import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { maintenanceMiddleware } from '../../middleware/maintenance.middleware';
import { ROLES } from '../../constants/roles';
import { getLabs, applyToLab } from '../../controllers/student/labs.controller';

const router = Router();

router.get('/', authenticate(ROLES.STUDENT), maintenanceMiddleware, getLabs);
router.post('/:labId/apply', authenticate(ROLES.STUDENT), maintenanceMiddleware, applyToLab);

export default router;
