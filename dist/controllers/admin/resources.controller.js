"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getResourcesByCourse = exports.getAllResources = exports.reorderResources = exports.deleteResource = exports.updateResource = exports.addResource = void 0;
const lesson_schema_1 = require("../../models/lesson.schema");
const lesson_resource_schema_1 = require("../../models/lesson_resource.schema");
const course_schema_1 = require("../../models/course.schema");
const sendResponse_1 = require("../../utils/sendResponse");
const admin_validator_1 = require("../../validators/admin.validator");
const addResource = async (req, res) => {
    try {
        const { error, value } = admin_validator_1.addResourceSchema.validate(req.body);
        if (error) {
            (0, sendResponse_1.sendResponse)(res, 400, { error: error.details[0].message });
            return;
        }
        const { lessonId } = req.params;
        const lesson = await lesson_schema_1.Lesson.findById(lessonId);
        if (!lesson) {
            (0, sendResponse_1.sendResponse)(res, 404, { error: 'Lesson not found.' });
            return;
        }
        const count = await lesson_resource_schema_1.LessonResource.countDocuments({ lesson: lessonId });
        const resource = await lesson_resource_schema_1.LessonResource.create({
            lesson: lessonId,
            course: lesson.course,
            title: value.title,
            type: value.type,
            url: value.url,
            description: value.description,
            status: value.status,
            order: count + 1,
        });
        (0, sendResponse_1.sendResponse)(res, 201, { resource, message: 'Resource added successfully.' });
    }
    catch (err) {
        console.error('[AdminAddResource Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.addResource = addResource;
const updateResource = async (req, res) => {
    try {
        const { error, value } = admin_validator_1.updateResourceSchema.validate(req.body);
        if (error) {
            (0, sendResponse_1.sendResponse)(res, 400, { error: error.details[0].message });
            return;
        }
        const { resourceId } = req.params;
        const resource = await lesson_resource_schema_1.LessonResource.findByIdAndUpdate(resourceId, { $set: value }, { new: true });
        if (!resource) {
            (0, sendResponse_1.sendResponse)(res, 404, { error: 'Resource not found.' });
            return;
        }
        (0, sendResponse_1.sendResponse)(res, 200, { resource, message: 'Resource updated.' });
    }
    catch (err) {
        console.error('[AdminUpdateResource Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.updateResource = updateResource;
const deleteResource = async (req, res) => {
    try {
        const { resourceId } = req.params;
        const resource = await lesson_resource_schema_1.LessonResource.findByIdAndDelete(resourceId);
        if (!resource) {
            (0, sendResponse_1.sendResponse)(res, 404, { error: 'Resource not found.' });
            return;
        }
        (0, sendResponse_1.sendResponse)(res, 200, { message: 'Resource deleted.' });
    }
    catch (err) {
        console.error('[AdminDeleteResource Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.deleteResource = deleteResource;
const reorderResources = async (req, res) => {
    try {
        const { error, value } = admin_validator_1.reorderSchema.validate(req.body);
        if (error) {
            (0, sendResponse_1.sendResponse)(res, 400, { error: error.details[0].message });
            return;
        }
        const updates = value.order.map((resourceId, index) => lesson_resource_schema_1.LessonResource.findByIdAndUpdate(resourceId, { order: index + 1 }));
        await Promise.all(updates);
        (0, sendResponse_1.sendResponse)(res, 200, { message: 'Resources reordered.' });
    }
    catch (err) {
        console.error('[AdminReorderResources Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.reorderResources = reorderResources;
const getAllResources = async (_req, res) => {
    try {
        const courses = await course_schema_1.Course.find().sort({ order: 1 }).select('title thumbnail');
        const result = await Promise.all(courses.map(async (course) => {
            const resourceCount = await lesson_resource_schema_1.LessonResource.countDocuments({ course: course._id });
            const lastResource = await lesson_resource_schema_1.LessonResource.findOne({ course: course._id }).sort({ createdAt: -1 });
            return {
                course: course.toObject(),
                resourceCount,
                lastUpdated: lastResource?.createdAt || null,
            };
        }));
        (0, sendResponse_1.sendResponse)(res, 200, { resources: result });
    }
    catch (err) {
        console.error('[AdminGetAllResources Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.getAllResources = getAllResources;
const getResourcesByCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await course_schema_1.Course.findById(courseId);
        if (!course) {
            (0, sendResponse_1.sendResponse)(res, 404, { error: 'Course not found.' });
            return;
        }
        const resources = await lesson_resource_schema_1.LessonResource.find({ course: courseId })
            .sort({ order: 1 })
            .populate({ path: 'lesson', select: 'title' });
        (0, sendResponse_1.sendResponse)(res, 200, { course: course.toObject(), resources });
    }
    catch (err) {
        console.error('[AdminGetResourcesByCourse Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.getResourcesByCourse = getResourcesByCourse;
//# sourceMappingURL=resources.controller.js.map