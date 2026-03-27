import { Router } from 'express';
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

router.get('/', getUsers);
router.post('/', createUser);
router.put('/:userId', updateUser);
router.patch('/:userId/ban', banUser);
router.patch('/:userId/unban', unbanUser);
router.post('/:userId/resend-email', resendWelcomeEmail);
router.delete('/:userId', deleteUser);

export default router;
