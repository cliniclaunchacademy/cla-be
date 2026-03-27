import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { ROLES } from '../../constants/roles';
import {
  getRecordingCategories,
  createRecordingCategory,
  updateRecordingCategory,
  deleteRecordingCategory,
  reorderRecordingCategories,
  getRecordings,
  createRecording,
  updateRecording,
  deleteRecording,
  reorderRecordings,
} from '../../controllers/admin/recordings.controller';

const router = Router();

// Category list
router.get('/', authenticate(ROLES.ADMIN), getRecordingCategories);

// Categories — reorder BEFORE :categoryId
router.post('/categories', authenticate(ROLES.ADMIN), createRecordingCategory);
router.patch('/categories/reorder', authenticate(ROLES.ADMIN), reorderRecordingCategories);
router.get('/categories/:categoryId/recordings', authenticate(ROLES.ADMIN), getRecordings);
router.post('/categories/:categoryId/recordings', authenticate(ROLES.ADMIN), createRecording);
router.patch('/categories/:categoryId/recordings/reorder', authenticate(ROLES.ADMIN), reorderRecordings);
router.put('/categories/:categoryId', authenticate(ROLES.ADMIN), updateRecordingCategory);
router.delete('/categories/:categoryId', authenticate(ROLES.ADMIN), deleteRecordingCategory);

// Individual recordings
router.put('/:recordingId', authenticate(ROLES.ADMIN), updateRecording);
router.delete('/:recordingId', authenticate(ROLES.ADMIN), deleteRecording);

export default router;
