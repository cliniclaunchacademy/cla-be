import { Router } from 'express';
import { getLabs, applyToLab } from '../../controllers/student/labs.controller';

const router = Router();

router.get('/', getLabs);
router.post('/:labId/apply', applyToLab);

export default router;
