import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { ROLES } from '../../constants/roles';
import { getAdminMe, updateAdminProfile, uploadAdminProfilePhoto } from '../../controllers/admin/profile.controller';
import { imageUpload } from '../../utils/upload';

const router = Router();

router.get('/me', authenticate(ROLES.ADMIN), getAdminMe);
router.patch('/profile', authenticate(ROLES.ADMIN), updateAdminProfile);
router.post('/photo', authenticate(ROLES.ADMIN), imageUpload.single('photo'), uploadAdminProfilePhoto);

export default router;
