"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const maintenance_middleware_1 = require("../../middleware/maintenance.middleware");
const roles_1 = require("../../constants/roles");
const courses_controller_1 = require("../../controllers/student/courses.controller");
const router = (0, express_1.Router)();
router.get('/', (0, auth_middleware_1.authenticate)(roles_1.ROLES.STUDENT), maintenance_middleware_1.maintenanceMiddleware, courses_controller_1.getCourses);
router.get('/:courseId', (0, auth_middleware_1.authenticate)(roles_1.ROLES.STUDENT), maintenance_middleware_1.maintenanceMiddleware, courses_controller_1.getCourseDetail);
router.get('/:courseId/lessons/:lessonId', (0, auth_middleware_1.authenticate)(roles_1.ROLES.STUDENT), maintenance_middleware_1.maintenanceMiddleware, courses_controller_1.getLessonDetail);
router.post('/:courseId/lessons/:lessonId/complete', (0, auth_middleware_1.authenticate)(roles_1.ROLES.STUDENT), maintenance_middleware_1.maintenanceMiddleware, courses_controller_1.completeLesson);
router.post('/:courseId/lessons/:lessonId/flag-video', (0, auth_middleware_1.authenticate)(roles_1.ROLES.STUDENT), maintenance_middleware_1.maintenanceMiddleware, courses_controller_1.flagVideo);
exports.default = router;
//# sourceMappingURL=courses.routes.js.map