"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const roles_1 = require("../../constants/roles");
const recordings_controller_1 = require("../../controllers/admin/recordings.controller");
const router = (0, express_1.Router)();
router.get('/', (0, auth_middleware_1.authenticate)(roles_1.ROLES.ADMIN), recordings_controller_1.getRecordingCategories);
router.post('/categories', (0, auth_middleware_1.authenticate)(roles_1.ROLES.ADMIN), recordings_controller_1.createRecordingCategory);
router.patch('/categories/reorder', (0, auth_middleware_1.authenticate)(roles_1.ROLES.ADMIN), recordings_controller_1.reorderRecordingCategories);
router.get('/categories/:categoryId/recordings', (0, auth_middleware_1.authenticate)(roles_1.ROLES.ADMIN), recordings_controller_1.getRecordings);
router.post('/categories/:categoryId/recordings', (0, auth_middleware_1.authenticate)(roles_1.ROLES.ADMIN), recordings_controller_1.createRecording);
router.patch('/categories/:categoryId/recordings/reorder', (0, auth_middleware_1.authenticate)(roles_1.ROLES.ADMIN), recordings_controller_1.reorderRecordings);
router.put('/categories/:categoryId', (0, auth_middleware_1.authenticate)(roles_1.ROLES.ADMIN), recordings_controller_1.updateRecordingCategory);
router.delete('/categories/:categoryId', (0, auth_middleware_1.authenticate)(roles_1.ROLES.ADMIN), recordings_controller_1.deleteRecordingCategory);
router.put('/:recordingId', (0, auth_middleware_1.authenticate)(roles_1.ROLES.ADMIN), recordings_controller_1.updateRecording);
router.delete('/:recordingId', (0, auth_middleware_1.authenticate)(roles_1.ROLES.ADMIN), recordings_controller_1.deleteRecording);
exports.default = router;
//# sourceMappingURL=recordings.routes.js.map