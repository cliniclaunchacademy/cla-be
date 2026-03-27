import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { ROLES } from '../../constants/roles';
import {
  getInstructors,
  createInstructor,
  uploadInstructorPhoto,
  updateInstructor,
  deleteInstructor,
} from '../../controllers/admin/instructors.controller';
import { imageUpload } from '../../utils/upload';

const router = Router();

router.get('/', authenticate(ROLES.ADMIN), getInstructors);
router.post('/', authenticate(ROLES.ADMIN), createInstructor);
router.post('/:instructorId/photo', authenticate(ROLES.ADMIN), imageUpload.single('photo'), uploadInstructorPhoto);
router.put('/:instructorId', authenticate(ROLES.ADMIN), updateInstructor);
router.delete('/:instructorId', authenticate(ROLES.ADMIN), deleteInstructor);

export default router;
