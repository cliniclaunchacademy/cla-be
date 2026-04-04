"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLesson = exports.reorderLessons = exports.updateLesson = exports.createLesson = exports.deleteModule = exports.reorderModules = exports.updateModule = exports.createModule = exports.getCourseEditor = exports.deleteCourse = exports.reorderCourses = exports.updateCourse = exports.uploadCourseBanner = exports.uploadCourseThumbnail = exports.createCourse = exports.getCourses = void 0;
const course_schema_1 = require("../../models/course.schema");
const module_schema_1 = require("../../models/module.schema");
const lesson_schema_1 = require("../../models/lesson.schema");
const lesson_resource_schema_1 = require("../../models/lesson_resource.schema");
const sendResponse_1 = require("../../utils/sendResponse");
const upload_1 = require("../../utils/upload");
const admin_validator_1 = require("../../validators/admin.validator");
const getCourses = async (_req, res) => {
    try {
        const courses = await course_schema_1.Course.find()
            .sort({ order: 1 })
            .populate({ path: 'instructor', select: 'firstName lastName title photo' });
        const coursesWithCounts = await Promise.all(courses.map(async (course) => {
            const moduleCount = await module_schema_1.Module.countDocuments({ course: course._id });
            const lessonCount = await lesson_schema_1.Lesson.countDocuments({ course: course._id });
            return { ...course.toObject(), moduleCount, lessonCount };
        }));
        (0, sendResponse_1.sendResponse)(res, 200, { courses: coursesWithCounts });
    }
    catch (err) {
        console.error('[AdminGetCourses Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.getCourses = getCourses;
const createCourse = async (req, res) => {
    try {
        const { error, value } = admin_validator_1.createCourseSchema.validate(req.body);
        if (error) {
            (0, sendResponse_1.sendResponse)(res, 400, { error: error.details[0].message });
            return;
        }
        const { title, subheading, about, instructorId, status, comingSoon, releaseDate, banner } = value;
        const count = await course_schema_1.Course.countDocuments();
        const course = await course_schema_1.Course.create({
            title,
            subheading,
            about,
            banner,
            instructor: instructorId,
            status,
            comingSoon: comingSoon || false,
            releaseDate,
            order: count + 1,
        });
        const populated = await course.populate({ path: 'instructor', select: 'firstName lastName title' });
        (0, sendResponse_1.sendResponse)(res, 201, { course: populated, message: 'Course created successfully.' });
    }
    catch (err) {
        console.error('[AdminCreateCourse Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.createCourse = createCourse;
const uploadCourseThumbnail = async (req, res) => {
    try {
        const { courseId } = req.params;
        if (!req.file) {
            (0, sendResponse_1.sendResponse)(res, 400, { error: 'No image file provided.' });
            return;
        }
        const thumbnailUrl = await (0, upload_1.uploadToCloudinary)(req.file.buffer, 'cla/courses-thumbnails');
        const course = await course_schema_1.Course.findByIdAndUpdate(courseId, { $set: { thumbnail: thumbnailUrl } }, { new: true });
        if (!course) {
            (0, sendResponse_1.sendResponse)(res, 404, { error: 'Course not found.' });
            return;
        }
        (0, sendResponse_1.sendResponse)(res, 200, { thumbnail: thumbnailUrl, message: 'Thumbnail uploaded.' });
    }
    catch (err) {
        console.error('[AdminUploadCourseThumbnail Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.uploadCourseThumbnail = uploadCourseThumbnail;
const uploadCourseBanner = async (req, res) => {
    try {
        const { courseId } = req.params;
        if (!req.file) {
            (0, sendResponse_1.sendResponse)(res, 400, { error: 'No image file provided.' });
            return;
        }
        const bannerUrl = await (0, upload_1.uploadToCloudinary)(req.file.buffer, 'cla/courses-backgrounds');
        const course = await course_schema_1.Course.findByIdAndUpdate(courseId, { $set: { banner: bannerUrl } }, { new: true });
        if (!course) {
            (0, sendResponse_1.sendResponse)(res, 404, { error: 'Course not found.' });
            return;
        }
        (0, sendResponse_1.sendResponse)(res, 200, { banner: bannerUrl, message: 'Banner uploaded.' });
    }
    catch (err) {
        console.error('[AdminUploadCourseBanner Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.uploadCourseBanner = uploadCourseBanner;
const updateCourse = async (req, res) => {
    try {
        const { error, value } = admin_validator_1.updateCourseSchema.validate(req.body);
        if (error) {
            (0, sendResponse_1.sendResponse)(res, 400, { error: error.details[0].message });
            return;
        }
        const { courseId } = req.params;
        const updateData = {};
        if (value.title !== undefined)
            updateData.title = value.title;
        if (value.subheading !== undefined)
            updateData.subheading = value.subheading;
        if (value.about !== undefined)
            updateData.about = value.about;
        if (req.file) {
            updateData.banner = await (0, upload_1.uploadToCloudinary)(req.file.buffer, 'cla/courses-backgrounds');
        }
        else if (value.banner !== undefined) {
            updateData.banner = value.banner;
        }
        if (value.instructorId !== undefined)
            updateData.instructor = value.instructorId;
        if (value.status !== undefined)
            updateData.status = value.status;
        if (value.comingSoon !== undefined)
            updateData.comingSoon = value.comingSoon;
        if (value.releaseDate !== undefined)
            updateData.releaseDate = value.releaseDate;
        const course = await course_schema_1.Course.findByIdAndUpdate(courseId, { $set: updateData }, { new: true }).populate({ path: 'instructor', select: 'firstName lastName title' });
        if (!course) {
            (0, sendResponse_1.sendResponse)(res, 404, { error: 'Course not found.' });
            return;
        }
        (0, sendResponse_1.sendResponse)(res, 200, { course, message: 'Course updated successfully.' });
    }
    catch (err) {
        console.error('[AdminUpdateCourse Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.updateCourse = updateCourse;
const reorderCourses = async (req, res) => {
    try {
        const { error, value } = admin_validator_1.reorderSchema.validate(req.body);
        if (error) {
            (0, sendResponse_1.sendResponse)(res, 400, { error: error.details[0].message });
            return;
        }
        const { order } = value;
        const updates = order.map((courseId, index) => course_schema_1.Course.findByIdAndUpdate(courseId, { order: index + 1 }));
        await Promise.all(updates);
        (0, sendResponse_1.sendResponse)(res, 200, { message: 'Courses reordered successfully.' });
    }
    catch (err) {
        console.error('[AdminReorderCourses Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.reorderCourses = reorderCourses;
const deleteCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await course_schema_1.Course.findById(courseId);
        if (!course) {
            (0, sendResponse_1.sendResponse)(res, 404, { error: 'Course not found.' });
            return;
        }
        const lessons = await lesson_schema_1.Lesson.find({ course: courseId });
        const lessonIds = lessons.map((l) => l._id);
        await Promise.all([
            lesson_resource_schema_1.LessonResource.deleteMany({ lesson: { $in: lessonIds } }),
            lesson_schema_1.Lesson.deleteMany({ course: courseId }),
            module_schema_1.Module.deleteMany({ course: courseId }),
            course_schema_1.Course.findByIdAndDelete(courseId),
        ]);
        (0, sendResponse_1.sendResponse)(res, 200, { message: 'Course and all related content deleted.' });
    }
    catch (err) {
        console.error('[AdminDeleteCourse Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.deleteCourse = deleteCourse;
const getCourseEditor = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await course_schema_1.Course.findById(courseId).populate({
            path: 'instructor',
            select: 'firstName lastName title bio photo',
        });
        if (!course) {
            (0, sendResponse_1.sendResponse)(res, 404, { error: 'Course not found.' });
            return;
        }
        const modules = await module_schema_1.Module.find({ course: courseId }).sort({ order: 1 });
        const modulesWithLessons = await Promise.all(modules.map(async (mod) => {
            const lessons = await lesson_schema_1.Lesson.find({ module: mod._id }).sort({ order: 1 });
            return { ...mod.toObject(), lessons: lessons.map((l) => l.toObject()) };
        }));
        (0, sendResponse_1.sendResponse)(res, 200, { course: course.toObject(), modules: modulesWithLessons });
    }
    catch (err) {
        console.error('[AdminGetCourseEditor Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.getCourseEditor = getCourseEditor;
const createModule = async (req, res) => {
    try {
        const { error, value } = admin_validator_1.createModuleSchema.validate(req.body);
        if (error) {
            (0, sendResponse_1.sendResponse)(res, 400, { error: error.details[0].message });
            return;
        }
        const { courseId } = req.params;
        const count = await module_schema_1.Module.countDocuments({ course: courseId });
        const module = await module_schema_1.Module.create({
            course: courseId,
            title: value.title,
            order: count + 1,
        });
        (0, sendResponse_1.sendResponse)(res, 201, { module, message: 'Module created successfully.' });
    }
    catch (err) {
        console.error('[AdminCreateModule Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.createModule = createModule;
const updateModule = async (req, res) => {
    try {
        const { error, value } = admin_validator_1.updateModuleSchema.validate(req.body);
        if (error) {
            (0, sendResponse_1.sendResponse)(res, 400, { error: error.details[0].message });
            return;
        }
        const { moduleId } = req.params;
        const module = await module_schema_1.Module.findByIdAndUpdate(moduleId, { $set: { title: value.title } }, { new: true });
        if (!module) {
            (0, sendResponse_1.sendResponse)(res, 404, { error: 'Module not found.' });
            return;
        }
        (0, sendResponse_1.sendResponse)(res, 200, { module, message: 'Module updated.' });
    }
    catch (err) {
        console.error('[AdminUpdateModule Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.updateModule = updateModule;
const reorderModules = async (req, res) => {
    try {
        const { error, value } = admin_validator_1.reorderSchema.validate(req.body);
        if (error) {
            (0, sendResponse_1.sendResponse)(res, 400, { error: error.details[0].message });
            return;
        }
        const updates = value.order.map((moduleId, index) => module_schema_1.Module.findByIdAndUpdate(moduleId, { order: index + 1 }));
        await Promise.all(updates);
        (0, sendResponse_1.sendResponse)(res, 200, { message: 'Modules reordered successfully.' });
    }
    catch (err) {
        console.error('[AdminReorderModules Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.reorderModules = reorderModules;
const deleteModule = async (req, res) => {
    try {
        const { moduleId } = req.params;
        const module = await module_schema_1.Module.findById(moduleId);
        if (!module) {
            (0, sendResponse_1.sendResponse)(res, 404, { error: 'Module not found.' });
            return;
        }
        const lessons = await lesson_schema_1.Lesson.find({ module: moduleId });
        const lessonIds = lessons.map((l) => l._id);
        await Promise.all([
            lesson_resource_schema_1.LessonResource.deleteMany({ lesson: { $in: lessonIds } }),
            lesson_schema_1.Lesson.deleteMany({ module: moduleId }),
            module_schema_1.Module.findByIdAndDelete(moduleId),
        ]);
        (0, sendResponse_1.sendResponse)(res, 200, { message: 'Module and lessons deleted.' });
    }
    catch (err) {
        console.error('[AdminDeleteModule Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.deleteModule = deleteModule;
const createLesson = async (req, res) => {
    try {
        const { error, value } = admin_validator_1.createLessonSchema.validate(req.body);
        if (error) {
            (0, sendResponse_1.sendResponse)(res, 400, { error: error.details[0].message });
            return;
        }
        const { courseId, moduleId } = req.params;
        const module = await module_schema_1.Module.findOne({ _id: moduleId, course: courseId });
        if (!module) {
            (0, sendResponse_1.sendResponse)(res, 404, { error: 'Module not found.' });
            return;
        }
        const count = await lesson_schema_1.Lesson.countDocuments({ module: moduleId });
        const lesson = await lesson_schema_1.Lesson.create({
            module: moduleId,
            course: courseId,
            title: value.title,
            subheading: value.subheading,
            videoEmbed: value.videoEmbed,
            status: value.status,
            comingSoon: value.comingSoon || false,
            releaseDate: value.releaseDate,
            order: count + 1,
        });
        (0, sendResponse_1.sendResponse)(res, 201, { lesson, message: 'Lesson created successfully.' });
    }
    catch (err) {
        console.error('[AdminCreateLesson Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.createLesson = createLesson;
const updateLesson = async (req, res) => {
    try {
        const { error, value } = admin_validator_1.updateLessonSchema.validate(req.body);
        if (error) {
            (0, sendResponse_1.sendResponse)(res, 400, { error: error.details[0].message });
            return;
        }
        const { lessonId } = req.params;
        const updateData = {};
        if (value.title !== undefined)
            updateData.title = value.title;
        if (value.subheading !== undefined)
            updateData.subheading = value.subheading;
        if (value.videoEmbed !== undefined)
            updateData.videoEmbed = value.videoEmbed;
        if (value.status !== undefined)
            updateData.status = value.status;
        if (value.comingSoon !== undefined)
            updateData.comingSoon = value.comingSoon;
        if (value.releaseDate !== undefined)
            updateData.releaseDate = value.releaseDate;
        const lesson = await lesson_schema_1.Lesson.findByIdAndUpdate(lessonId, { $set: updateData }, { new: true });
        if (!lesson) {
            (0, sendResponse_1.sendResponse)(res, 404, { error: 'Lesson not found.' });
            return;
        }
        (0, sendResponse_1.sendResponse)(res, 200, { lesson, message: 'Lesson updated.' });
    }
    catch (err) {
        console.error('[AdminUpdateLesson Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.updateLesson = updateLesson;
const reorderLessons = async (req, res) => {
    try {
        const { error, value } = admin_validator_1.reorderSchema.validate(req.body);
        if (error) {
            (0, sendResponse_1.sendResponse)(res, 400, { error: error.details[0].message });
            return;
        }
        const updates = value.order.map((lessonId, index) => lesson_schema_1.Lesson.findByIdAndUpdate(lessonId, { order: index + 1 }));
        await Promise.all(updates);
        (0, sendResponse_1.sendResponse)(res, 200, { message: 'Lessons reordered successfully.' });
    }
    catch (err) {
        console.error('[AdminReorderLessons Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.reorderLessons = reorderLessons;
const deleteLesson = async (req, res) => {
    try {
        const { lessonId } = req.params;
        const lesson = await lesson_schema_1.Lesson.findById(lessonId);
        if (!lesson) {
            (0, sendResponse_1.sendResponse)(res, 404, { error: 'Lesson not found.' });
            return;
        }
        await Promise.all([
            lesson_resource_schema_1.LessonResource.deleteMany({ lesson: lessonId }),
            lesson_schema_1.Lesson.findByIdAndDelete(lessonId),
        ]);
        (0, sendResponse_1.sendResponse)(res, 200, { message: 'Lesson and resources deleted.' });
    }
    catch (err) {
        console.error('[AdminDeleteLesson Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.deleteLesson = deleteLesson;
//# sourceMappingURL=courses.controller.js.map