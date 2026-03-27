import { Router } from 'express';
import {
  getInstructors,
  createInstructor,
  uploadInstructorPhoto,
  updateInstructor,
  deleteInstructor,
} from '../../controllers/admin/instructors.controller';
import { imageUpload } from '../../utils/upload';

const router = Router();

router.get('/', getInstructors);
router.post('/', createInstructor);
router.post('/:instructorId/photo', imageUpload.single('photo'), uploadInstructorPhoto);
router.put('/:instructorId', updateInstructor);
router.delete('/:instructorId', deleteInstructor);

export default router;
