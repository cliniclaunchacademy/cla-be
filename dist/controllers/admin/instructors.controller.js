"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteInstructor = exports.updateInstructor = exports.uploadInstructorPhoto = exports.createInstructor = exports.getInstructors = void 0;
const instructor_schema_1 = require("../../models/instructor.schema");
const course_schema_1 = require("../../models/course.schema");
const sendResponse_1 = require("../../utils/sendResponse");
const upload_1 = require("../../utils/upload");
const admin_validator_1 = require("../../validators/admin.validator");
const getInstructors = async (_req, res) => {
    try {
        const instructors = await instructor_schema_1.Instructor.find().sort({ createdAt: -1 });
        const instructorsWithCount = await Promise.all(instructors.map(async (instructor) => {
            const coursesAssigned = await course_schema_1.Course.countDocuments({ instructor: instructor._id });
            return { ...instructor.toObject(), coursesAssigned };
        }));
        (0, sendResponse_1.sendResponse)(res, 200, { instructors: instructorsWithCount });
    }
    catch (err) {
        console.error('[AdminGetInstructors Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.getInstructors = getInstructors;
const createInstructor = async (req, res) => {
    try {
        const { error, value } = admin_validator_1.createInstructorSchema.validate(req.body);
        if (error) {
            (0, sendResponse_1.sendResponse)(res, 400, { error: error.details[0].message });
            return;
        }
        const instructor = await instructor_schema_1.Instructor.create(value);
        (0, sendResponse_1.sendResponse)(res, 201, { instructor, message: 'Instructor created successfully.' });
    }
    catch (err) {
        console.error('[AdminCreateInstructor Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.createInstructor = createInstructor;
const uploadInstructorPhoto = async (req, res) => {
    try {
        const { instructorId } = req.params;
        if (!req.file) {
            (0, sendResponse_1.sendResponse)(res, 400, { error: 'No image file provided.' });
            return;
        }
        const photoUrl = await (0, upload_1.uploadToCloudinary)(req.file.buffer, 'cla/instructors');
        const instructor = await instructor_schema_1.Instructor.findByIdAndUpdate(instructorId, { $set: { photo: photoUrl } }, { new: true });
        if (!instructor) {
            (0, sendResponse_1.sendResponse)(res, 404, { error: 'Instructor not found.' });
            return;
        }
        (0, sendResponse_1.sendResponse)(res, 200, { photo: photoUrl, message: 'Instructor photo updated.' });
    }
    catch (err) {
        console.error('[AdminUploadInstructorPhoto Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.uploadInstructorPhoto = uploadInstructorPhoto;
const updateInstructor = async (req, res) => {
    try {
        const { error, value } = admin_validator_1.updateInstructorSchema.validate(req.body);
        if (error) {
            (0, sendResponse_1.sendResponse)(res, 400, { error: error.details[0].message });
            return;
        }
        const { instructorId } = req.params;
        const instructor = await instructor_schema_1.Instructor.findByIdAndUpdate(instructorId, { $set: value }, { new: true });
        if (!instructor) {
            (0, sendResponse_1.sendResponse)(res, 404, { error: 'Instructor not found.' });
            return;
        }
        (0, sendResponse_1.sendResponse)(res, 200, { instructor, message: 'Instructor updated.' });
    }
    catch (err) {
        console.error('[AdminUpdateInstructor Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.updateInstructor = updateInstructor;
const deleteInstructor = async (req, res) => {
    try {
        const { instructorId } = req.params;
        const instructor = await instructor_schema_1.Instructor.findById(instructorId);
        if (!instructor) {
            (0, sendResponse_1.sendResponse)(res, 404, { error: 'Instructor not found.' });
            return;
        }
        const activeCourse = await course_schema_1.Course.findOne({
            instructor: instructorId,
            status: { $ne: 'draft' },
        });
        if (activeCourse) {
            (0, sendResponse_1.sendResponse)(res, 400, {
                error: 'Cannot delete instructor assigned to published or unpublished courses.',
            });
            return;
        }
        await instructor_schema_1.Instructor.findByIdAndDelete(instructorId);
        (0, sendResponse_1.sendResponse)(res, 200, { message: 'Instructor deleted.' });
    }
    catch (err) {
        console.error('[AdminDeleteInstructor Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.deleteInstructor = deleteInstructor;
//# sourceMappingURL=instructors.controller.js.map