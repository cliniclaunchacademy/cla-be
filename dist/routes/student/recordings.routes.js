"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const maintenance_middleware_1 = require("../../middleware/maintenance.middleware");
const roles_1 = require("../../constants/roles");
const recordings_controller_1 = require("../../controllers/student/recordings.controller");
const router = (0, express_1.Router)();
router.get('/', (0, auth_middleware_1.authenticate)(roles_1.ROLES.STUDENT), maintenance_middleware_1.maintenanceMiddleware, recordings_controller_1.getRecordingCategories);
router.get('/:categoryId', (0, auth_middleware_1.authenticate)(roles_1.ROLES.STUDENT), maintenance_middleware_1.maintenanceMiddleware, recordings_controller_1.getRecordingsByCategory);
exports.default = router;
//# sourceMappingURL=recordings.routes.js.map