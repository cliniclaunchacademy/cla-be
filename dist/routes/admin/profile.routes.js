"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const roles_1 = require("../../constants/roles");
const profile_controller_1 = require("../../controllers/admin/profile.controller");
const upload_1 = require("../../utils/upload");
const router = (0, express_1.Router)();
router.get('/me', (0, auth_middleware_1.authenticate)(roles_1.ROLES.ADMIN), profile_controller_1.getAdminMe);
router.patch('/profile', (0, auth_middleware_1.authenticate)(roles_1.ROLES.ADMIN), profile_controller_1.updateAdminProfile);
router.post('/photo', (0, auth_middleware_1.authenticate)(roles_1.ROLES.ADMIN), upload_1.imageUpload.single('photo'), profile_controller_1.uploadAdminProfilePhoto);
exports.default = router;
//# sourceMappingURL=profile.routes.js.map