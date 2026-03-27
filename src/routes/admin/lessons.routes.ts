import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { ROLES } from '../../constants/roles';
import {
  addResource,
  updateResource,
  deleteResource,
  reorderResources,
} from '../../controllers/admin/resources.controller';

const router = Router();

// Resources on a lesson — reorder BEFORE :resourceId
router.post('/:lessonId/resources', authenticate(ROLES.ADMIN), addResource);
router.patch('/:lessonId/resources/reorder', authenticate(ROLES.ADMIN), reorderResources);
router.put('/:lessonId/resources/:resourceId', authenticate(ROLES.ADMIN), updateResource);
router.delete('/:lessonId/resources/:resourceId', authenticate(ROLES.ADMIN), deleteResource);

export default router;
