import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { maintenanceMiddleware } from '../../middleware/maintenance.middleware';
import { ROLES } from '../../constants/roles';
import {
  getCourses,
  getCourseDetail,
  getLessonDetail,
  completeLesson,
  flagVideo,
} from '../../controllers/student/courses.controller';

const router = Router();

router.get('/', authenticate(ROLES.STUDENT), maintenanceMiddleware, getCourses);
router.get('/:courseId', authenticate(ROLES.STUDENT), maintenanceMiddleware, getCourseDetail);
router.get('/:courseId/lessons/:lessonId', authenticate(ROLES.STUDENT), maintenanceMiddleware, getLessonDetail);
router.post('/:courseId/lessons/:lessonId/complete', authenticate(ROLES.STUDENT), maintenanceMiddleware, completeLesson);
router.post('/:courseId/lessons/:lessonId/flag-video', authenticate(ROLES.STUDENT), maintenanceMiddleware, flagVideo);

export default router;
