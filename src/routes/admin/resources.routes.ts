import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { ROLES } from '../../constants/roles';
import {
  getAllResources,
  getResourcesByCourse,
} from '../../controllers/admin/resources.controller';

const router = Router();

router.get('/', authenticate(ROLES.ADMIN), getAllResources);
router.get('/:courseId', authenticate(ROLES.ADMIN), getResourcesByCourse);

export default router;
