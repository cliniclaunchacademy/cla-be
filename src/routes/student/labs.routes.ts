import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { maintenanceMiddleware } from '../../middleware/maintenance.middleware';
import { ROLES } from '../../constants/roles';
import { getLabs } from '../../controllers/student/labs.controller';

const router = Router();

// Lab applications are submitted via GHL form → POST /api/webhooks/ghl/lab-application
// Students view their application status through this GET endpoint
router.get('/', authenticate(ROLES.STUDENT), maintenanceMiddleware, getLabs);

export default router;
