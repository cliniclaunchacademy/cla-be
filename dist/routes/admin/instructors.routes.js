"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const roles_1 = require("../../constants/roles");
const instructors_controller_1 = require("../../controllers/admin/instructors.controller");
const upload_1 = require("../../utils/upload");
const router = (0, express_1.Router)();
router.get('/', (0, auth_middleware_1.authenticate)(roles_1.ROLES.ADMIN), instructors_controller_1.getInstructors);
router.post('/', (0, auth_middleware_1.authenticate)(roles_1.ROLES.ADMIN), instructors_controller_1.createInstructor);
router.post('/:instructorId/photo', (0, auth_middleware_1.authenticate)(roles_1.ROLES.ADMIN), upload_1.imageUpload.single('photo'), instructors_controller_1.uploadInstructorPhoto);
router.put('/:instructorId', (0, auth_middleware_1.authenticate)(roles_1.ROLES.ADMIN), instructors_controller_1.updateInstructor);
router.delete('/:instructorId', (0, auth_middleware_1.authenticate)(roles_1.ROLES.ADMIN), instructors_controller_1.deleteInstructor);
exports.default = router;
//# sourceMappingURL=instructors.routes.js.map