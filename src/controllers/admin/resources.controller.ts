import { Request, Response } from 'express';
import { Lesson } from '../../models/lesson.schema';
import { LessonResource } from '../../models/lesson_resource.schema';
import { Course } from '../../models/course.schema';
import { sendResponse } from '../../utils/sendResponse';
import {
  addResourceSchema,
  updateResourceSchema,
  reorderSchema,
} from '../../validators/admin.validator';

export const addResource = async (req: Request, res: Response): Promise<void> => {
  try {
    const { error, value } = addResourceSchema.validate(req.body);
    if (error) {
      sendResponse(res, 400, { error: error.details[0].message });
      return;
    }

    const { lessonId } = req.params;

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      sendResponse(res, 404, { error: 'Lesson not found.' });
      return;
    }

    const count = await LessonResource.countDocuments({ lesson: lessonId });

    const resource = await LessonResource.create({
      lesson: lessonId,
      course: lesson.course,
      title: value.title,
      type: value.type,
      url: value.url,
      description: value.description,
      status: value.status,
      order: count + 1,
    });

    sendResponse(res, 201, { resource, message: 'Resource added successfully.' });
  } catch (err) {
    console.error('[AdminAddResource Error]', err);
    sendResponse(res, 500, { error: 'Internal server error.' });
  }
};

export const updateResource = async (req: Request, res: Response): Promise<void> => {
  try {
    const { error, value } = updateResourceSchema.validate(req.body);
    if (error) {
      sendResponse(res, 400, { error: error.details[0].message });
      return;
    }

    const { resourceId } = req.params;

    const resource = await LessonResource.findByIdAndUpdate(
      resourceId,
      { $set: value },
      { new: true }
    );

    if (!resource) {
      sendResponse(res, 404, { error: 'Resource not found.' });
      return;
    }

    sendResponse(res, 200, { resource, message: 'Resource updated.' });
  } catch (err) {
    console.error('[AdminUpdateResource Error]', err);
    sendResponse(res, 500, { error: 'Internal server error.' });
  }
};

export const deleteResource = async (req: Request, res: Response): Promise<void> => {
  try {
    const { resourceId } = req.params;

    const resource = await LessonResource.findByIdAndDelete(resourceId);
    if (!resource) {
      sendResponse(res, 404, { error: 'Resource not found.' });
      return;
    }

    sendResponse(res, 200, { message: 'Resource deleted.' });
  } catch (err) {
    console.error('[AdminDeleteResource Error]', err);
    sendResponse(res, 500, { error: 'Internal server error.' });
  }
};

export const reorderResources = async (req: Request, res: Response): Promise<void> => {
  try {
    const { error, value } = reorderSchema.validate(req.body);
    if (error) {
      sendResponse(res, 400, { error: error.details[0].message });
      return;
    }

    const updates = value.order.map((resourceId: string, index: number) =>
      LessonResource.findByIdAndUpdate(resourceId, { order: index + 1 })
    );
    await Promise.all(updates);

    sendResponse(res, 200, { message: 'Resources reordered.' });
  } catch (err) {
    console.error('[AdminReorderResources Error]', err);
    sendResponse(res, 500, { error: 'Internal server error.' });
  }
};

export const getAllResources = async (_req: Request, res: Response): Promise<void> => {
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
    sendResponse(res, 500, { error: 'Internal server error.' });
  }
};

export const getResourcesByCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      sendResponse(res, 404, { error: 'Course not found.' });
      return;
    }

    const resources = await LessonResource.find({ course: courseId })
      .sort({ order: 1 })
      .populate({ path: 'lesson', select: 'title' });

    sendResponse(res, 200, { course: course.toObject(), resources });
  } catch (err) {
    console.error('[AdminGetResourcesByCourse Error]', err);
    sendResponse(res, 500, { error: 'Internal server error.' });
  }
};
