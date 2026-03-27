import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { maintenanceMiddleware } from '../../middleware/maintenance.middleware';
import { ROLES } from '../../constants/roles';
import { updateProfile, uploadProfilePhoto } from '../../controllers/student/profile.controller';
import { imageUpload } from '../../utils/upload';

const router = Router();

router.patch('/profile', authenticate(ROLES.STUDENT), maintenanceMiddleware, updateProfile);
router.post('/photo', authenticate(ROLES.STUDENT), maintenanceMiddleware, imageUpload.single('photo'), uploadProfilePhoto);

export default router;
