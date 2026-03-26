import { Router } from 'express';
import authRoutes from './auth.routes';
import studentRoutes from './student.routes';
import adminRoutes from './admin.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/student', studentRoutes);
router.use('/admin', adminRoutes);

export default router;
