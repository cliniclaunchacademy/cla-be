"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reorderRecordings = exports.deleteRecording = exports.updateRecording = exports.createRecording = exports.getRecordings = exports.reorderRecordingCategories = exports.deleteRecordingCategory = exports.updateRecordingCategory = exports.createRecordingCategory = exports.getRecordingCategories = void 0;
const recording_category_schema_1 = require("../../models/recording_category.schema");
const recording_schema_1 = require("../../models/recording.schema");
const sendResponse_1 = require("../../utils/sendResponse");
const admin_validator_1 = require("../../validators/admin.validator");
const getRecordingCategories = async (_req, res) => {
    try {
        const categories = await recording_category_schema_1.RecordingCategory.find().sort({ order: 1 });
        const categoriesWithCount = await Promise.all(categories.map(async (cat) => {
            const count = await recording_schema_1.Recording.countDocuments({ category: cat._id });
            return { ...cat.toObject(), recordingCount: count };
        }));
        (0, sendResponse_1.sendResponse)(res, 200, { categories: categoriesWithCount });
    }
    catch (err) {
        console.error('[AdminGetRecordingCategories Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.getRecordingCategories = getRecordingCategories;
const createRecordingCategory = async (req, res) => {
    try {
        const { error, value } = admin_validator_1.createRecordingCategorySchema.validate(req.body);
        if (error) {
            (0, sendResponse_1.sendResponse)(res, 400, { error: error.details[0].message });
            return;
        }
        const count = await recording_category_schema_1.RecordingCategory.countDocuments();
        const category = await recording_category_schema_1.RecordingCategory.create({ ...value, order: count + 1 });
        (0, sendResponse_1.sendResponse)(res, 201, { category, message: 'Recording category created.' });
    }
    catch (err) {
        console.error('[AdminCreateRecordingCategory Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.createRecordingCategory = createRecordingCategory;
const updateRecordingCategory = async (req, res) => {
    try {
        const { error, value } = admin_validator_1.updateRecordingCategorySchema.validate(req.body);
        if (error) {
            (0, sendResponse_1.sendResponse)(res, 400, { error: error.details[0].message });
            return;
        }
        const { categoryId } = req.params;
        const category = await recording_category_schema_1.RecordingCategory.findByIdAndUpdate(categoryId, { $set: value }, { new: true });
        if (!category) {
            (0, sendResponse_1.sendResponse)(res, 404, { error: 'Category not found.' });
            return;
        }
        (0, sendResponse_1.sendResponse)(res, 200, { category, message: 'Category updated.' });
    }
    catch (err) {
        console.error('[AdminUpdateRecordingCategory Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.updateRecordingCategory = updateRecordingCategory;
const deleteRecordingCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const category = await recording_category_schema_1.RecordingCategory.findById(categoryId);
        if (!category) {
            (0, sendResponse_1.sendResponse)(res, 404, { error: 'Category not found.' });
            return;
        }
        await Promise.all([
            recording_schema_1.Recording.deleteMany({ category: categoryId }),
            recording_category_schema_1.RecordingCategory.findByIdAndDelete(categoryId),
        ]);
        (0, sendResponse_1.sendResponse)(res, 200, { message: 'Category and all recordings deleted.' });
    }
    catch (err) {
        console.error('[AdminDeleteRecordingCategory Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.deleteRecordingCategory = deleteRecordingCategory;
const reorderRecordingCategories = async (req, res) => {
    try {
        const { error, value } = admin_validator_1.reorderSchema.validate(req.body);
        if (error) {
            (0, sendResponse_1.sendResponse)(res, 400, { error: error.details[0].message });
            return;
        }
        const updates = value.order.map((catId, index) => recording_category_schema_1.RecordingCategory.findByIdAndUpdate(catId, { order: index + 1 }));
        await Promise.all(updates);
        (0, sendResponse_1.sendResponse)(res, 200, { message: 'Categories reordered.' });
    }
    catch (err) {
        console.error('[AdminReorderRecordingCategories Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.reorderRecordingCategories = reorderRecordingCategories;
const getRecordings = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const category = await recording_category_schema_1.RecordingCategory.findById(categoryId);
        if (!category) {
            (0, sendResponse_1.sendResponse)(res, 404, { error: 'Category not found.' });
            return;
        }
        const recordings = await recording_schema_1.Recording.find({ category: categoryId }).sort({ order: 1 });
        (0, sendResponse_1.sendResponse)(res, 200, { category: category.toObject(), recordings });
    }
    catch (err) {
        console.error('[AdminGetRecordings Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.getRecordings = getRecordings;
const createRecording = async (req, res) => {
    try {
        const { error, value } = admin_validator_1.createRecordingSchema.validate(req.body);
        if (error) {
            (0, sendResponse_1.sendResponse)(res, 400, { error: error.details[0].message });
            return;
        }
        const { categoryId } = req.params;
        const category = await recording_category_schema_1.RecordingCategory.findById(categoryId);
        if (!category) {
            (0, sendResponse_1.sendResponse)(res, 404, { error: 'Category not found.' });
            return;
        }
        const count = await recording_schema_1.Recording.countDocuments({ category: categoryId });
        const recording = await recording_schema_1.Recording.create({ ...value, category: categoryId, order: count + 1 });
        (0, sendResponse_1.sendResponse)(res, 201, { recording, message: 'Recording created.' });
    }
    catch (err) {
        console.error('[AdminCreateRecording Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.createRecording = createRecording;
const updateRecording = async (req, res) => {
    try {
        const { error, value } = admin_validator_1.updateRecordingSchema.validate(req.body);
        if (error) {
            (0, sendResponse_1.sendResponse)(res, 400, { error: error.details[0].message });
            return;
        }
        const { recordingId } = req.params;
        const { categoryId, ...rest } = value;
        const updateData = { ...rest, ...(categoryId !== undefined && { category: categoryId }) };
        const recording = await recording_schema_1.Recording.findByIdAndUpdate(recordingId, { $set: updateData }, { new: true });
        if (!recording) {
            (0, sendResponse_1.sendResponse)(res, 404, { error: 'Recording not found.' });
            return;
        }
        (0, sendResponse_1.sendResponse)(res, 200, { recording, message: 'Recording updated.' });
    }
    catch (err) {
        console.error('[AdminUpdateRecording Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.updateRecording = updateRecording;
const deleteRecording = async (req, res) => {
    try {
        const { recordingId } = req.params;
        const recording = await recording_schema_1.Recording.findByIdAndDelete(recordingId);
        if (!recording) {
            (0, sendResponse_1.sendResponse)(res, 404, { error: 'Recording not found.' });
            return;
        }
        (0, sendResponse_1.sendResponse)(res, 200, { message: 'Recording deleted.' });
    }
    catch (err) {
        console.error('[AdminDeleteRecording Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.deleteRecording = deleteRecording;
const reorderRecordings = async (req, res) => {
    try {
        const { error, value } = admin_validator_1.reorderSchema.validate(req.body);
        if (error) {
            (0, sendResponse_1.sendResponse)(res, 400, { error: error.details[0].message });
            return;
        }
        const updates = value.order.map((recordingId, index) => recording_schema_1.Recording.findByIdAndUpdate(recordingId, { order: index + 1 }));
        await Promise.all(updates);
        (0, sendResponse_1.sendResponse)(res, 200, { message: 'Recordings reordered.' });
    }
    catch (err) {
        console.error('[AdminReorderRecordings Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.reorderRecordings = reorderRecordings;
//# sourceMappingURL=recordings.controller.js.map