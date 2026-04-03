import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { ROLES } from '../../constants/roles';
import {
  getBanners,
  getActiveBanners,
  createBanner,
  updateBanner,
  reorderBanners,
  deleteBanner,
} from '../../controllers/admin/banners.controller';
import { imageUpload } from '../../utils/upload';

const router = Router();

// reorder and active BEFORE :bannerId
router.get('/', authenticate(ROLES.ADMIN), getBanners);
router.get('/active', authenticate(ROLES.ADMIN), getActiveBanners);
router.post('/', authenticate(ROLES.ADMIN), imageUpload.single('image'), createBanner);
router.patch('/reorder', authenticate(ROLES.ADMIN), reorderBanners);
router.patch('/:bannerId', authenticate(ROLES.ADMIN), updateBanner);
router.delete('/:bannerId', authenticate(ROLES.ADMIN), deleteBanner);

export default router;
