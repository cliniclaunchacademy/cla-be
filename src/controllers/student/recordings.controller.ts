import { Request, Response } from 'express';
import { RecordingCategory } from '../../models/recording_category.schema';
import { Recording } from '../../models/recording.schema';
import { sendResponse } from '../../utils/sendResponse';

export const getRecordingCategories = async (_req: Request, res: Response): Promise<void> => {
  try {
    const categories = await RecordingCategory.find({ status: 'published' }).sort({ order: 1 });

    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const recordingCount = await Recording.countDocuments({ category: cat._id, status: 'published' });
        return { ...cat.toObject(), recordingCount };
      })
    );

    sendResponse(res, 200, { categories: categoriesWithCount });
  } catch (err) {
    console.error('[GetRecordingCategories Error]', err);
    sendResponse(res, 500, { error: 'Internal server error.' });
  }
};

export const getRecordingsByCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { categoryId } = req.params;
    const { search, from, to } = req.query;

    const category = await RecordingCategory.findOne({ _id: categoryId, status: 'published' });
    if (!category) {
      sendResponse(res, 404, { error: 'Recording category not found.' });
      return;
    }

    const filter: Record<string, unknown> = { category: categoryId, status: 'published' };

    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    if (from || to) {
      const dateFilter: Record<string, Date> = {};
      if (from) dateFilter.$gte = new Date(from as string);
      if (to) dateFilter.$lte = new Date(to as string);
      filter.recordedDate = dateFilter;
    }

    const recordings = await Recording.find(filter).sort({ order: 1 });

    sendResponse(res, 200, {
      category: category.toObject(),
      recordings,
    });
  } catch (err) {
    console.error('[GetRecordingsByCategory Error]', err);
    sendResponse(res, 500, { error: 'Internal server error.' });
  }
};
