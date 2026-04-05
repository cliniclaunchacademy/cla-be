import { Response } from 'express';
import { ExpressRequest } from '../../types/types';
import { Lesson } from '../../models/lesson.schema';
import { LessonResource } from '../../models/lesson_resource.schema';
import { Course } from '../../models/course.schema';
import { sendResponse, sendError } from '../../utils/sendResponse';
import { uploadToCloudinary } from '../../utils/upload';
import {
  addResourceSchema,
  updateResourceSchema,
  reorderSchema,
} from '../../validators/admin.validator';

export const addResource = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const { error, value } = addResourceSchema.validate(req.body);
    if (error) {
      sendError(res, 400, error.details[0].message);
      return;
    }

    let url: string = value.url || '';

    if (req.file) {
      url = await uploadToCloudinary(req.file.buffer, 'cla/lesson-resources', 'auto');
    }

    if (!url) {
      sendError(res, 400, 'Please provide either a file upload or a URL for this resource.');
      return;
    }

    const { lessonId } = req.params;

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      sendError(res, 404, 'Lesson not found.');
      return;
    }

    const count = await LessonResource.countDocuments({ lesson: lessonId });

    const resource = await LessonResource.create({
      lesson: lessonId,
      course: lesson.course,
      title: value.title,
      type: value.type,
      url,
      description: value.description,
      status: value.status,
      order: count + 1,
    });

    sendResponse(res, 201, { resource, message: 'Resource added successfully.' });
  } catch (err) {
    console.error('[AdminAddResource Error]', err);
    sendError(res, 500, 'Failed to add resource. Please try again.');
  }
};

export const updateResource = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const { error, value } = updateResourceSchema.validate(req.body);
    if (error) {
      sendError(res, 400, error.details[0].message);
      return;
    }

    const { resourceId } = req.params;

    if (req.file) {
      value.url = await uploadToCloudinary(req.file.buffer, 'cla/lesson-resources', 'auto');
    }

    const resource = await LessonResource.findByIdAndUpdate(
      resourceId,
      { $set: value },
      { new: true }
    );

    if (!resource) {
      sendError(res, 404, 'Resource not found.');
      return;
    }

    sendResponse(res, 200, { resource, message: 'Resource updated.' });
  } catch (err) {
    console.error('[AdminUpdateResource Error]', err);
    sendError(res, 500, 'Failed to update resource. Please try again.');
  }
};

export const deleteResource = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const { resourceId } = req.params;

    const resource = await LessonResource.findByIdAndDelete(resourceId);
    if (!resource) {
      sendError(res, 404, 'Resource not found.');
      return;
    }

    sendResponse(res, 200, { message: 'Resource deleted.' });
  } catch (err) {
    console.error('[AdminDeleteResource Error]', err);
    sendError(res, 500, 'Failed to delete resource. Please try again.');
  }
};

export const reorderResources = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const { error, value } = reorderSchema.validate(req.body);
    if (error) {
      sendError(res, 400, error.details[0].message);
      return;
    }

    const updates = value.order.map((resourceId: string, index: number) =>
      LessonResource.findByIdAndUpdate(resourceId, { order: index + 1 })
    );
    await Promise.all(updates);

    sendResponse(res, 200, { message: 'Resources reordered.' });
  } catch (err) {
    console.error('[AdminReorderResources Error]', err);
    sendError(res, 500, 'Failed to reorder resources. Please try again.');
  }
};

export const getAllResources = async (_req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const courses = await Course.find().sort({ order: 1 }).select('title thumbnail');

    const result = await Promise.all(
      courses.map(async (course) => {
        const resourceCount = await LessonResource.countDocuments({ course: course._id });
        const lastResource = await LessonResource.findOne({ course: course._id }).sort({ createdAt: -1 });
        return {
          course: course.toObject(),
          resourceCount,
          lastUpdated: lastResource?.createdAt || null,
        };
      })
    );

    sendResponse(res, 200, { resources: result });
  } catch (err) {
    console.error('[AdminGetAllResources Error]', err);
    sendError(res, 500, 'Failed to load resources. Please try again.');
  }
};

export const getResourcesByCourse = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      sendError(res, 404, 'Course not found.');
      return;
    }

    const resources = await LessonResource.find({ course: courseId })
      .sort({ order: 1 })
      .populate({ path: 'lesson', select: 'title' });

    sendResponse(res, 200, { course: course.toObject(), resources });
  } catch (err) {
    console.error('[AdminGetResourcesByCourse Error]', err);
    sendError(res, 500, 'Failed to load course resources. Please try again.');
  }
};
