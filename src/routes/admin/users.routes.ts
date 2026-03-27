import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { ROLES } from '../../constants/roles';
import {
  getUsers,
  createUser,
  updateUser,
  banUser,
  unbanUser,
  resendWelcomeEmail,
  deleteUser,
} from '../../controllers/admin/users.controller';

const router = Router();

router.get('/', authenticate(ROLES.ADMIN), getUsers);
router.post('/', authenticate(ROLES.ADMIN), createUser);
router.put('/:userId', authenticate(ROLES.ADMIN), updateUser);
router.patch('/:userId/ban', authenticate(ROLES.ADMIN), banUser);
router.patch('/:userId/unban', authenticate(ROLES.ADMIN), unbanUser);
router.post('/:userId/resend-email', authenticate(ROLES.ADMIN), resendWelcomeEmail);
router.delete('/:userId', authenticate(ROLES.ADMIN), deleteUser);

export default router;
