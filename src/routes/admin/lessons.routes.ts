import { Router } from 'express';
import {
  addResource,
  updateResource,
  deleteResource,
  reorderResources,
} from '../../controllers/admin/resources.controller';

const router = Router();

// Resources on a lesson — reorder BEFORE :resourceId
router.post('/:lessonId/resources', addResource);
router.patch('/:lessonId/resources/reorder', reorderResources);
router.put('/:lessonId/resources/:resourceId', updateResource);
router.delete('/:lessonId/resources/:resourceId', deleteResource);

export default router;
