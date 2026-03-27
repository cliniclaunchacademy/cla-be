import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { ROLES } from '../../constants/roles';
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
router.get('/', authenticate(ROLES.ADMIN), getCourses);
router.post('/', authenticate(ROLES.ADMIN), createCourse);
router.patch('/reorder', authenticate(ROLES.ADMIN), reorderCourses);
router.get('/:courseId/editor', authenticate(ROLES.ADMIN), getCourseEditor);
router.post('/:courseId/thumbnail', authenticate(ROLES.ADMIN), imageUpload.single('thumbnail'), uploadCourseThumbnail);
router.put('/:courseId', authenticate(ROLES.ADMIN), updateCourse);
router.delete('/:courseId', authenticate(ROLES.ADMIN), deleteCourse);

// Modules — reorder BEFORE :moduleId
router.post('/:courseId/modules', authenticate(ROLES.ADMIN), createModule);
router.patch('/:courseId/modules/reorder', authenticate(ROLES.ADMIN), reorderModules);
router.put('/:courseId/modules/:moduleId', authenticate(ROLES.ADMIN), updateModule);
router.delete('/:courseId/modules/:moduleId', authenticate(ROLES.ADMIN), deleteModule);

// Lessons — reorder BEFORE :lessonId
router.post('/:courseId/modules/:moduleId/lessons', authenticate(ROLES.ADMIN), createLesson);
router.patch('/:courseId/modules/:moduleId/lessons/reorder', authenticate(ROLES.ADMIN), reorderLessons);
router.put('/:courseId/modules/:moduleId/lessons/:lessonId', authenticate(ROLES.ADMIN), updateLesson);
router.delete('/:courseId/modules/:moduleId/lessons/:lessonId', authenticate(ROLES.ADMIN), deleteLesson);

export default router;
