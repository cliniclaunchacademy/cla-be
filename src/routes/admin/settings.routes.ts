import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { ROLES } from '../../constants/roles';
import { getSettings, saveSettings } from '../../controllers/admin/settings.controller';

const router = Router();

router.get('/', authenticate(ROLES.ADMIN), getSettings);
router.put('/', authenticate(ROLES.ADMIN), saveSettings);

export default router;
