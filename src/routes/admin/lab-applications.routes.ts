import { Router } from 'express';
import {
  getLabApplications,
  getLabApplicationDetail,
  updateApplicationStatus,
} from '../../controllers/admin/labs.controller';

const router = Router();

router.get('/', getLabApplications);
router.get('/:applicationId', getLabApplicationDetail);
router.patch('/:applicationId/status', updateApplicationStatus);

export default router;
