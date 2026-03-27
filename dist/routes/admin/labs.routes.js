"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const roles_1 = require("../../constants/roles");
const labs_controller_1 = require("../../controllers/admin/labs.controller");
const upload_1 = require("../../utils/upload");
const router = (0, express_1.Router)();
router.get('/', (0, auth_middleware_1.authenticate)(roles_1.ROLES.ADMIN), labs_controller_1.getLabs);
router.post('/', (0, auth_middleware_1.authenticate)(roles_1.ROLES.ADMIN), labs_controller_1.createLab);
router.patch('/reorder', (0, auth_middleware_1.authenticate)(roles_1.ROLES.ADMIN), labs_controller_1.reorderLabs);
router.post('/:labId/logo', (0, auth_middleware_1.authenticate)(roles_1.ROLES.ADMIN), upload_1.imageUpload.single('logo'), labs_controller_1.uploadLabLogo);
router.put('/:labId', (0, auth_middleware_1.authenticate)(roles_1.ROLES.ADMIN), labs_controller_1.updateLab);
router.delete('/:labId', (0, auth_middleware_1.authenticate)(roles_1.ROLES.ADMIN), labs_controller_1.deleteLab);
exports.default = router;
//# sourceMappingURL=labs.routes.js.map