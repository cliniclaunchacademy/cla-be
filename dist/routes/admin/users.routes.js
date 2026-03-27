"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const roles_1 = require("../../constants/roles");
const users_controller_1 = require("../../controllers/admin/users.controller");
const router = (0, express_1.Router)();
router.get('/', (0, auth_middleware_1.authenticate)(roles_1.ROLES.ADMIN), users_controller_1.getUsers);
router.post('/', (0, auth_middleware_1.authenticate)(roles_1.ROLES.ADMIN), users_controller_1.createUser);
router.put('/:userId', (0, auth_middleware_1.authenticate)(roles_1.ROLES.ADMIN), users_controller_1.updateUser);
router.patch('/:userId/ban', (0, auth_middleware_1.authenticate)(roles_1.ROLES.ADMIN), users_controller_1.banUser);
router.patch('/:userId/unban', (0, auth_middleware_1.authenticate)(roles_1.ROLES.ADMIN), users_controller_1.unbanUser);
router.post('/:userId/resend-email', (0, auth_middleware_1.authenticate)(roles_1.ROLES.ADMIN), users_controller_1.resendWelcomeEmail);
router.delete('/:userId', (0, auth_middleware_1.authenticate)(roles_1.ROLES.ADMIN), users_controller_1.deleteUser);
exports.default = router;
//# sourceMappingURL=users.routes.js.map