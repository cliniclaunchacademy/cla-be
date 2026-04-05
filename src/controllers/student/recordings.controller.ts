import { Response } from 'express';
import { ExpressRequest } from '../../types/types';
import { RecordingCategory } from '../../models/recording_category.schema';
import { Recording } from '../../models/recording.schema';
import { sendResponse, sendError } from '../../utils/sendResponse';

export const getRecordingCategories = async (_req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const categories = await RecordingCategory.find({ status: 'published' }).sort({ order: 1 });

    const categoriesWithRecordings = await Promise.all(
      categories.map(async (cat) => {
        const recordings = await Recording.find({ category: cat._id, status: 'published' })
          .sort({ order: 1 })
          .select('_id title subheading videoEmbed recordedDate');
        return { _id: cat._id, name: cat.name, recordings };
      })
    );

    sendResponse(res, 200, { categories: categoriesWithRecordings });
  } catch (err) {
    console.error('[GetRecordingCategories Error]', err);
    sendError(res, 500, 'Failed to load recordings. Please try again.');
  }
};

export const getRecording = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const recording = await Recording.findOne({ _id: id, status: 'published' }).populate<{
      category: { name: string };
    }>({ path: 'category', select: 'name' });

    if (!recording) {
      sendError(res, 404, 'Recording not found.');
      return;
    }

    sendResponse(res, 200, {
      recording: {
        _id: recording._id,
        title: recording.title,
        subheading: recording.subheading,
        videoEmbed: recording.videoEmbed,
        recordedDate: recording.recordedDate,
        categoryName: recording.category.name,
      },
    });
  } catch (err) {
    console.error('[GetRecording Error]', err);
    sendError(res, 500, 'Failed to load recording. Please try again.');
  }
};
