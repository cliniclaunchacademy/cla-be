import { Response } from 'express';
import { ExpressRequest } from '../../types/types';
import { RecordingCategory } from '../../models/recording_category.schema';
import { Recording } from '../../models/recording.schema';
import { sendResponse, sendError } from '../../utils/sendResponse';
import {
  createRecordingCategorySchema,
  updateRecordingCategorySchema,
  createRecordingSchema,
  updateRecordingSchema,
  reorderSchema,
} from '../../validators/admin.validator';

export const getRecordingCategories = async (_req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const categories = await RecordingCategory.find().sort({ order: 1 });

    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const count = await Recording.countDocuments({ category: cat._id });
        return { ...cat.toObject(), recordingCount: count };
      })
    );

    sendResponse(res, 200, { categories: categoriesWithCount });
  } catch (err) {
    console.error('[AdminGetRecordingCategories Error]', err);
    sendError(res, 500, 'Failed to load recording categories. Please try again.');
  }
};

export const createRecordingCategory = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const { error, value } = createRecordingCategorySchema.validate(req.body);
    if (error) {
      sendError(res, 400, error.details[0].message);
      return;
    }

    const count = await RecordingCategory.countDocuments();
    const category = await RecordingCategory.create({ ...value, order: count + 1 });

    sendResponse(res, 201, { category, message: 'Recording category created.' });
  } catch (err) {
    console.error('[AdminCreateRecordingCategory Error]', err);
    sendError(res, 500, 'Failed to create recording category. Please try again.');
  }
};

export const updateRecordingCategory = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const { error, value } = updateRecordingCategorySchema.validate(req.body);
    if (error) {
      sendError(res, 400, error.details[0].message);
      return;
    }

    const { categoryId } = req.params;
    const category = await RecordingCategory.findByIdAndUpdate(
      categoryId,
      { $set: value },
      { new: true }
    );

    if (!category) {
      sendError(res, 404, 'Recording category not found.');
      return;
    }

    sendResponse(res, 200, { category, message: 'Category updated.' });
  } catch (err) {
    console.error('[AdminUpdateRecordingCategory Error]', err);
    sendError(res, 500, 'Failed to update recording category. Please try again.');
  }
};

export const deleteRecordingCategory = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const { categoryId } = req.params;

    const category = await RecordingCategory.findById(categoryId);
    if (!category) {
      sendError(res, 404, 'Recording category not found.');
      return;
    }

    await Promise.all([
      Recording.deleteMany({ category: categoryId }),
      RecordingCategory.findByIdAndDelete(categoryId),
    ]);

    sendResponse(res, 200, { message: 'Category and all recordings deleted.' });
  } catch (err) {
    console.error('[AdminDeleteRecordingCategory Error]', err);
    sendError(res, 500, 'Failed to delete recording category. Please try again.');
  }
};

export const reorderRecordingCategories = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const { error, value } = reorderSchema.validate(req.body);
    if (error) {
      sendError(res, 400, error.details[0].message);
      return;
    }

    const updates = value.order.map((catId: string, index: number) =>
      RecordingCategory.findByIdAndUpdate(catId, { order: index + 1 })
    );
    await Promise.all(updates);

    sendResponse(res, 200, { message: 'Categories reordered.' });
  } catch (err) {
    console.error('[AdminReorderRecordingCategories Error]', err);
    sendError(res, 500, 'Failed to reorder categories. Please try again.');
  }
};

export const getRecordings = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const { categoryId } = req.params;

    const category = await RecordingCategory.findById(categoryId);
    if (!category) {
      sendError(res, 404, 'Recording category not found.');
      return;
    }

    const recordings = await Recording.find({ category: categoryId }).sort({ order: 1 });
    sendResponse(res, 200, { category: category.toObject(), recordings });
  } catch (err) {
    console.error('[AdminGetRecordings Error]', err);
    sendError(res, 500, 'Failed to load recordings. Please try again.');
  }
};

export const createRecording = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const { error, value } = createRecordingSchema.validate(req.body);
    if (error) {
      sendError(res, 400, error.details[0].message);
      return;
    }

    const { categoryId } = req.params;

    const category = await RecordingCategory.findById(categoryId);
    if (!category) {
      sendError(res, 404, 'Recording category not found.');
      return;
    }

    const count = await Recording.countDocuments({ category: categoryId });
    const recording = await Recording.create({ ...value, category: categoryId, order: count + 1 });

    sendResponse(res, 201, { recording, message: 'Recording created.' });
  } catch (err) {
    console.error('[AdminCreateRecording Error]', err);
    sendError(res, 500, 'Failed to create recording. Please try again.');
  }
};

export const updateRecording = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const { error, value } = updateRecordingSchema.validate(req.body);
    if (error) {
      sendError(res, 400, error.details[0].message);
      return;
    }

    const { recordingId } = req.params;
    const { categoryId, ...rest } = value;
    const updateData = { ...rest, ...(categoryId !== undefined && { category: categoryId }) };
    const recording = await Recording.findByIdAndUpdate(
      recordingId,
      { $set: updateData },
      { new: true }
    );

    if (!recording) {
      sendError(res, 404, 'Recording not found.');
      return;
    }

    sendResponse(res, 200, { recording, message: 'Recording updated.' });
  } catch (err) {
    console.error('[AdminUpdateRecording Error]', err);
    sendError(res, 500, 'Failed to update recording. Please try again.');
  }
};

export const deleteRecording = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const { recordingId } = req.params;

    const recording = await Recording.findByIdAndDelete(recordingId);
    if (!recording) {
      sendError(res, 404, 'Recording not found.');
      return;
    }

    sendResponse(res, 200, { message: 'Recording deleted.' });
  } catch (err) {
    console.error('[AdminDeleteRecording Error]', err);
    sendError(res, 500, 'Failed to delete recording. Please try again.');
  }
};

export const reorderRecordings = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const { error, value } = reorderSchema.validate(req.body);
    if (error) {
      sendError(res, 400, error.details[0].message);
      return;
    }

    const updates = value.order.map((recordingId: string, index: number) =>
      Recording.findByIdAndUpdate(recordingId, { order: index + 1 })
    );
    await Promise.all(updates);

    sendResponse(res, 200, { message: 'Recordings reordered.' });
  } catch (err) {
    console.error('[AdminReorderRecordings Error]', err);
    sendError(res, 500, 'Failed to reorder recordings. Please try again.');
  }
};
