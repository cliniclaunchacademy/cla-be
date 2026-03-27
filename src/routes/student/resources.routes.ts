import { Router } from 'express';
import { getStudentResources } from '../../controllers/student/courses.controller';

const router = Router();

router.get('/', getStudentResources);

export default router;
