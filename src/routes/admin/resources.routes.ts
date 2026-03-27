import { Router } from 'express';
import {
  getAllResources,
  getResourcesByCourse,
} from '../../controllers/admin/resources.controller';

const router = Router();

router.get('/', getAllResources);
router.get('/:courseId', getResourcesByCourse);

export default router;
