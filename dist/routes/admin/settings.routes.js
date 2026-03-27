"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const roles_1 = require("../../constants/roles");
const settings_controller_1 = require("../../controllers/admin/settings.controller");
const router = (0, express_1.Router)();
router.get('/', (0, auth_middleware_1.authenticate)(roles_1.ROLES.ADMIN), settings_controller_1.getSettings);
router.put('/', (0, auth_middleware_1.authenticate)(roles_1.ROLES.ADMIN), settings_controller_1.saveSettings);
exports.default = router;
//# sourceMappingURL=settings.routes.js.map