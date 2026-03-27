import { Router } from 'express';
import { updateProfile, uploadProfilePhoto } from '../../controllers/student/profile.controller';
import { imageUpload } from '../../utils/upload';

const router = Router();

router.patch('/profile', updateProfile);
router.post('/photo', imageUpload.single('photo'), uploadProfilePhoto);

export default router;
