import { Router } from 'express';
import {
  getCourses,
  getCourseDetail,
  getLessonDetail,
  completeLesson,
  flagVideo,
} from '../../controllers/student/courses.controller';

const router = Router();

router.get('/', getCourses);
router.get('/:courseId', getCourseDetail);
router.get('/:courseId/lessons/:lessonId', getLessonDetail);
router.post('/:courseId/lessons/:lessonId/complete', completeLesson);
router.post('/:courseId/lessons/:lessonId/flag-video', flagVideo);

export default router;
