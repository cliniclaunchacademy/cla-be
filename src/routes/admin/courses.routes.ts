import { Router } from 'express';
import {
  getCourses,
  createCourse,
  uploadCourseThumbnail,
  updateCourse,
  reorderCourses,
  deleteCourse,
  getCourseEditor,
  createModule,
  updateModule,
  reorderModules,
  deleteModule,
  createLesson,
  updateLesson,
  reorderLessons,
  deleteLesson,
} from '../../controllers/admin/courses.controller';
import { imageUpload } from '../../utils/upload';

const router = Router();

// Courses — reorder BEFORE :courseId to avoid param conflicts
router.get('/', getCourses);
router.post('/', createCourse);
router.patch('/reorder', reorderCourses);
router.get('/:courseId/editor', getCourseEditor);
router.post('/:courseId/thumbnail', imageUpload.single('thumbnail'), uploadCourseThumbnail);
router.put('/:courseId', updateCourse);
router.delete('/:courseId', deleteCourse);

// Modules — reorder BEFORE :moduleId
router.post('/:courseId/modules', createModule);
router.patch('/:courseId/modules/reorder', reorderModules);
router.put('/:courseId/modules/:moduleId', updateModule);
router.delete('/:courseId/modules/:moduleId', deleteModule);

// Lessons — reorder BEFORE :lessonId
router.post('/:courseId/modules/:moduleId/lessons', createLesson);
router.patch('/:courseId/modules/:moduleId/lessons/reorder', reorderLessons);
router.put('/:courseId/modules/:moduleId/lessons/:lessonId', updateLesson);
router.delete('/:courseId/modules/:moduleId/lessons/:lessonId', deleteLesson);

export default router;
