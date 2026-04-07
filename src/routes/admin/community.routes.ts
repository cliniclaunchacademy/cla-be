import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { ROLES } from '../../constants/roles';
import {
  getCommunityLinks,
  createCommunityLink,
  uploadCommunityLinkImage,
  updateCommunityLink,
  deleteCommunityLink,
} from '../../controllers/admin/community.controller';
import { imageUpload } from '../../utils/upload';

const router = Router();

router.get('/', authenticate(ROLES.ADMIN), getCommunityLinks);
router.post('/', authenticate(ROLES.ADMIN), createCommunityLink);
router.post('/:linkId/image', authenticate(ROLES.ADMIN), imageUpload.single('image'), uploadCommunityLinkImage);
router.put('/:linkId', authenticate(ROLES.ADMIN), updateCommunityLink);
router.delete('/:linkId', authenticate(ROLES.ADMIN), deleteCommunityLink);

export default router;
