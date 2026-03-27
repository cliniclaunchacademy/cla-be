import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { ROLES } from '../../constants/roles';
import {
  getLabApplications,
  getLabApplicationDetail,
  updateApplicationStatus,
} from '../../controllers/admin/labs.controller';

const router = Router();

router.get('/', authenticate(ROLES.ADMIN), getLabApplications);
router.get('/:applicationId', authenticate(ROLES.ADMIN), getLabApplicationDetail);
router.patch('/:applicationId/status', authenticate(ROLES.ADMIN), updateApplicationStatus);

export default router;
