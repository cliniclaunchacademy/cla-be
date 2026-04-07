import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { ROLES } from '../../constants/roles';
import {
  getLabApplications,
  getLabApplicationDetail,
  updateApplicationStatus,
  bulkUpdateApplicationStatus,
} from '../../controllers/admin/labs.controller';

const router = Router();

router.get('/', authenticate(ROLES.ADMIN), getLabApplications);
router.patch('/bulk-status', authenticate(ROLES.ADMIN), bulkUpdateApplicationStatus);
router.get('/:applicationId', authenticate(ROLES.ADMIN), getLabApplicationDetail);
router.patch('/:applicationId/status', authenticate(ROLES.ADMIN), updateApplicationStatus);

export default router;
