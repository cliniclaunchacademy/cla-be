"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecording = exports.getRecordingCategories = void 0;
const recording_category_schema_1 = require("../../models/recording_category.schema");
const recording_schema_1 = require("../../models/recording.schema");
const sendResponse_1 = require("../../utils/sendResponse");
const getRecordingCategories = async (_req, res) => {
    try {
        const categories = await recording_category_schema_1.RecordingCategory.find({ status: 'published' }).sort({ order: 1 });
        const categoriesWithRecordings = await Promise.all(categories.map(async (cat) => {
            const recordings = await recording_schema_1.Recording.find({ category: cat._id, status: 'published' })
                .sort({ order: 1 })
                .select('_id title subheading videoEmbed recordedDate');
            return { _id: cat._id, name: cat.name, recordings };
        }));
        (0, sendResponse_1.sendResponse)(res, 200, { categories: categoriesWithRecordings });
    }
    catch (err) {
        console.error('[GetRecordingCategories Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.getRecordingCategories = getRecordingCategories;
const getRecording = async (req, res) => {
    try {
        const { id } = req.params;
        const recording = await recording_schema_1.Recording.findOne({ _id: id, status: 'published' }).populate({ path: 'category', select: 'name' });
        if (!recording) {
            (0, sendResponse_1.sendResponse)(res, 404, { error: 'Recording not found.' });
            return;
        }
        (0, sendResponse_1.sendResponse)(res, 200, {
            recording: {
                _id: recording._id,
                title: recording.title,
                subheading: recording.subheading,
                videoEmbed: recording.videoEmbed,
                recordedDate: recording.recordedDate,
                categoryName: recording.category.name,
            },
        });
    }
    catch (err) {
        console.error('[GetRecording Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.getRecording = getRecording;
//# sourceMappingURL=recordings.controller.js.map