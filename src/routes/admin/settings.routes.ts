import { Router } from 'express';
import { getSettings, saveSettings } from '../../controllers/admin/settings.controller';

const router = Router();

router.get('/', getSettings);
router.put('/', saveSettings);

export default router;
