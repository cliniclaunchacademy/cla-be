import { Router } from 'express';
import {
  getBanners,
  createBanner,
  updateBanner,
  reorderBanners,
  deleteBanner,
} from '../../controllers/admin/banners.controller';
import { imageUpload } from '../../utils/upload';

const router = Router();

// reorder BEFORE :bannerId
router.get('/', getBanners);
router.post('/', imageUpload.single('image'), createBanner);
router.patch('/reorder', reorderBanners);
router.patch('/:bannerId', updateBanner);
router.delete('/:bannerId', deleteBanner);

export default router;
