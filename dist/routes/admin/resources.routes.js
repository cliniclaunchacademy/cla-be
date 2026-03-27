"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const roles_1 = require("../../constants/roles");
const resources_controller_1 = require("../../controllers/admin/resources.controller");
const router = (0, express_1.Router)();
router.get('/', (0, auth_middleware_1.authenticate)(roles_1.ROLES.ADMIN), resources_controller_1.getAllResources);
router.get('/:courseId', (0, auth_middleware_1.authenticate)(roles_1.ROLES.ADMIN), resources_controller_1.getResourcesByCourse);
exports.default = router;
//# sourceMappingURL=resources.routes.js.map