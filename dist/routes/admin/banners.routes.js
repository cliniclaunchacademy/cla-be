"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const roles_1 = require("../../constants/roles");
const banners_controller_1 = require("../../controllers/admin/banners.controller");
const upload_1 = require("../../utils/upload");
const router = (0, express_1.Router)();
router.get('/', (0, auth_middleware_1.authenticate)(roles_1.ROLES.ADMIN), banners_controller_1.getBanners);
router.post('/', (0, auth_middleware_1.authenticate)(roles_1.ROLES.ADMIN), upload_1.imageUpload.single('image'), banners_controller_1.createBanner);
router.patch('/reorder', (0, auth_middleware_1.authenticate)(roles_1.ROLES.ADMIN), banners_controller_1.reorderBanners);
router.patch('/:bannerId', (0, auth_middleware_1.authenticate)(roles_1.ROLES.ADMIN), banners_controller_1.updateBanner);
router.delete('/:bannerId', (0, auth_middleware_1.authenticate)(roles_1.ROLES.ADMIN), banners_controller_1.deleteBanner);
exports.default = router;
//# sourceMappingURL=banners.routes.js.map