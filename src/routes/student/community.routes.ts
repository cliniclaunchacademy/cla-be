import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { maintenanceMiddleware } from '../../middleware/maintenance.middleware';
import { ROLES } from '../../constants/roles';
import { getCommunityLinks } from '../../controllers/student/community.controller';

const router = Router();

router.get('/', authenticate(ROLES.STUDENT), maintenanceMiddleware, getCommunityLinks);

export default router;
