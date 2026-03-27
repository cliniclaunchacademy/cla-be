import { Router } from 'express';
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
router.get('/', getRecordingCategories);

// Categories — reorder BEFORE :categoryId
router.post('/categories', createRecordingCategory);
router.patch('/categories/reorder', reorderRecordingCategories);
router.get('/categories/:categoryId/recordings', getRecordings);
router.post('/categories/:categoryId/recordings', createRecording);
router.patch('/categories/:categoryId/recordings/reorder', reorderRecordings);
router.put('/categories/:categoryId', updateRecordingCategory);
router.delete('/categories/:categoryId', deleteRecordingCategory);

// Individual recordings
router.put('/:recordingId', updateRecording);
router.delete('/:recordingId', deleteRecording);

export default router;
