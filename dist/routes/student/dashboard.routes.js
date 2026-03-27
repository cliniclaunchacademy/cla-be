"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const maintenance_middleware_1 = require("../../middleware/maintenance.middleware");
const roles_1 = require("../../constants/roles");
const dashboard_controller_1 = require("../../controllers/student/dashboard.controller");
const router = (0, express_1.Router)();
router.get('/stats', (0, auth_middleware_1.authenticate)(roles_1.ROLES.STUDENT), maintenance_middleware_1.maintenanceMiddleware, dashboard_controller_1.getDashboardStats);
router.get('/continue-learning', (0, auth_middleware_1.authenticate)(roles_1.ROLES.STUDENT), maintenance_middleware_1.maintenanceMiddleware, dashboard_controller_1.getContinueLearning);
router.get('/banners', (0, auth_middleware_1.authenticate)(roles_1.ROLES.STUDENT), maintenance_middleware_1.maintenanceMiddleware, dashboard_controller_1.getDashboardBanners);
router.get('/community-banner', (0, auth_middleware_1.authenticate)(roles_1.ROLES.STUDENT), maintenance_middleware_1.maintenanceMiddleware, dashboard_controller_1.getCommunityBanner);
router.get('/recent-activity', (0, auth_middleware_1.authenticate)(roles_1.ROLES.STUDENT), maintenance_middleware_1.maintenanceMiddleware, dashboard_controller_1.getRecentActivity);
exports.default = router;
//# sourceMappingURL=dashboard.routes.js.map