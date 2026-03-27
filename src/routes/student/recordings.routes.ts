import { Router } from 'express';
import {
  getRecordingCategories,
  getRecordingsByCategory,
} from '../../controllers/student/recordings.controller';

const router = Router();

router.get('/', getRecordingCategories);
router.get('/:categoryId', getRecordingsByCategory);

export default router;
