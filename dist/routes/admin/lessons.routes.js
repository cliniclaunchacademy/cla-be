"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const roles_1 = require("../../constants/roles");
const resources_controller_1 = require("../../controllers/admin/resources.controller");
const router = (0, express_1.Router)();
router.post('/:lessonId/resources', (0, auth_middleware_1.authenticate)(roles_1.ROLES.ADMIN), resources_controller_1.addResource);
router.patch('/:lessonId/resources/reorder', (0, auth_middleware_1.authenticate)(roles_1.ROLES.ADMIN), resources_controller_1.reorderResources);
router.put('/:lessonId/resources/:resourceId', (0, auth_middleware_1.authenticate)(roles_1.ROLES.ADMIN), resources_controller_1.updateResource);
router.delete('/:lessonId/resources/:resourceId', (0, auth_middleware_1.authenticate)(roles_1.ROLES.ADMIN), resources_controller_1.deleteResource);
exports.default = router;
//# sourceMappingURL=lessons.routes.js.map