"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const roles_1 = require("../../constants/roles");
const notifications_controller_1 = require("../../controllers/admin/notifications.controller");
const router = (0, express_1.Router)();
router.post('/', (0, auth_middleware_1.authenticate)(roles_1.ROLES.ADMIN), notifications_controller_1.sendNotification);
router.delete('/:notificationId', (0, auth_middleware_1.authenticate)(roles_1.ROLES.ADMIN), notifications_controller_1.deleteNotification);
exports.default = router;
//# sourceMappingURL=notifications.routes.js.map