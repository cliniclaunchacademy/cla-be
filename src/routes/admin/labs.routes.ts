import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { ROLES } from '../../constants/roles';
import {
  getLabs,
  createLab,
  uploadLabLogo,
  updateLab,
  deleteLab,
  reorderLabs,
} from '../../controllers/admin/labs.controller';
import { imageUpload } from '../../utils/upload';

const router = Router();

// reorder BEFORE :labId
router.get('/', authenticate(ROLES.ADMIN), getLabs);
router.post('/', authenticate(ROLES.ADMIN), createLab);
router.patch('/reorder', authenticate(ROLES.ADMIN), reorderLabs);
router.post('/:labId/logo', authenticate(ROLES.ADMIN), imageUpload.single('logo'), uploadLabLogo);
router.put('/:labId', authenticate(ROLES.ADMIN), updateLab);
router.delete('/:labId', authenticate(ROLES.ADMIN), deleteLab);

export default router;
