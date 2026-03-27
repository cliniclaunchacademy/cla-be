"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const maintenance_middleware_1 = require("../../middleware/maintenance.middleware");
const roles_1 = require("../../constants/roles");
const profile_controller_1 = require("../../controllers/student/profile.controller");
const upload_1 = require("../../utils/upload");
const router = (0, express_1.Router)();
router.patch('/profile', (0, auth_middleware_1.authenticate)(roles_1.ROLES.STUDENT), maintenance_middleware_1.maintenanceMiddleware, profile_controller_1.updateProfile);
router.post('/photo', (0, auth_middleware_1.authenticate)(roles_1.ROLES.STUDENT), maintenance_middleware_1.maintenanceMiddleware, upload_1.imageUpload.single('photo'), profile_controller_1.uploadProfilePhoto);
exports.default = router;
//# sourceMappingURL=settings.routes.js.map