"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const roles_1 = require("../../constants/roles");
const labs_controller_1 = require("../../controllers/admin/labs.controller");
const router = (0, express_1.Router)();
router.get('/', (0, auth_middleware_1.authenticate)(roles_1.ROLES.ADMIN), labs_controller_1.getLabApplications);
router.get('/:applicationId', (0, auth_middleware_1.authenticate)(roles_1.ROLES.ADMIN), labs_controller_1.getLabApplicationDetail);
router.patch('/:applicationId/status', (0, auth_middleware_1.authenticate)(roles_1.ROLES.ADMIN), labs_controller_1.updateApplicationStatus);
exports.default = router;
//# sourceMappingURL=lab-applications.routes.js.map