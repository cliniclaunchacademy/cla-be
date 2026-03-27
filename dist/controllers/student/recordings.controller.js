"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecordingsByCategory = exports.getRecordingCategories = void 0;
const recording_category_schema_1 = require("../../models/recording_category.schema");
const recording_schema_1 = require("../../models/recording.schema");
const sendResponse_1 = require("../../utils/sendResponse");
const getRecordingCategories = async (_req, res) => {
    try {
        const categories = await recording_category_schema_1.RecordingCategory.find({ status: 'published' }).sort({ order: 1 });
        const categoriesWithCount = await Promise.all(categories.map(async (cat) => {
            const recordingCount = await recording_schema_1.Recording.countDocuments({ category: cat._id, status: 'published' });
            return { ...cat.toObject(), recordingCount };
        }));
        (0, sendResponse_1.sendResponse)(res, 200, { categories: categoriesWithCount });
    }
    catch (err) {
        console.error('[GetRecordingCategories Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.getRecordingCategories = getRecordingCategories;
const getRecordingsByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const { search, from, to } = req.query;
        const category = await recording_category_schema_1.RecordingCategory.findOne({ _id: categoryId, status: 'published' });
        if (!category) {
            (0, sendResponse_1.sendResponse)(res, 404, { error: 'Recording category not found.' });
            return;
        }
        const filter = { category: categoryId, status: 'published' };
        if (search) {
            filter.title = { $regex: search, $options: 'i' };
        }
        if (from || to) {
            const dateFilter = {};
            if (from)
                dateFilter.$gte = new Date(from);
            if (to)
                dateFilter.$lte = new Date(to);
            filter.recordedDate = dateFilter;
        }
        const recordings = await recording_schema_1.Recording.find(filter).sort({ order: 1 });
        (0, sendResponse_1.sendResponse)(res, 200, {
            category: category.toObject(),
            recordings,
        });
    }
    catch (err) {
        console.error('[GetRecordingsByCategory Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.getRecordingsByCategory = getRecordingsByCategory;
//# sourceMappingURL=recordings.controller.js.map