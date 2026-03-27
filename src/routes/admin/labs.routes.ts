import { Router } from 'express';
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
router.get('/', getLabs);
router.post('/', createLab);
router.patch('/reorder', reorderLabs);
router.post('/:labId/logo', imageUpload.single('logo'), uploadLabLogo);
router.put('/:labId', updateLab);
router.delete('/:labId', deleteLab);

export default router;
