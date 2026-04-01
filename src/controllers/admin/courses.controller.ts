import { Response } from 'express';
import { ExpressRequest } from '../../types/types';
import { Course } from '../../models/course.schema';
import { Module } from '../../models/module.schema';
import { Lesson } from '../../models/lesson.schema';
import { LessonResource } from '../../models/lesson_resource.schema';
import { sendResponse } from '../../utils/sendResponse';
import { uploadToCloudinary } from '../../utils/upload';
import {
  createCourseSchema,
  updateCourseSchema,
  reorderSchema,
  createModuleSchema,
  updateModuleSchema,
  createLessonSchema,
  updateLessonSchema,
} from '../../validators/admin.validator';

export const getCourses = async (_req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const courses = await Course.find()
      .sort({ order: 1 })
      .populate({ path: 'instructor', select: 'firstName lastName title photo' });

    const coursesWithCounts = await Promise.all(
      courses.map(async (course) => {
        const moduleCount = await Module.countDocuments({ course: course._id });
        const lessonCount = await Lesson.countDocuments({ course: course._id });
        return { ...course.toObject(), moduleCount, lessonCount };
      })
    );

    sendResponse(res, 200, { courses: coursesWithCounts });
  } catch (err) {
    console.error('[AdminGetCourses Error]', err);
    sendResponse(res, 500, { error: 'Internal server error.' });
  }
};

export const createCourse = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const { error, value } = createCourseSchema.validate(req.body);
    if (error) {
      sendResponse(res, 400, { error: error.details[0].message });
      return;
    }

    const { title, subheading, about, instructorId, status, comingSoon, releaseDate, banner } = value;

    const count = await Course.countDocuments();
    const course = await Course.create({
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
    sendResponse(res, 201, { course: populated, message: 'Course created successfully.' });
  } catch (err) {
    console.error('[AdminCreateCourse Error]', err);
    sendResponse(res, 500, { error: 'Internal server error.' });
  }
};

export const uploadCourseThumbnail = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const { courseId } = req.params;

    if (!req.file) {
      sendResponse(res, 400, { error: 'No image file provided.' });
      return;
    }

    const thumbnailUrl = await uploadToCloudinary(req.file.buffer, 'cla/courses-thumbnails');
    const course = await Course.findByIdAndUpdate(
      courseId,
      { $set: { thumbnail: thumbnailUrl } },
      { new: true }
    );

    if (!course) {
      sendResponse(res, 404, { error: 'Course not found.' });
      return;
    }

    sendResponse(res, 200, { thumbnail: thumbnailUrl, message: 'Thumbnail uploaded.' });
  } catch (err) {
    console.error('[AdminUploadCourseThumbnail Error]', err);
    sendResponse(res, 500, { error: 'Internal server error.' });
  }
};

export const updateCourse = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const { error, value } = updateCourseSchema.validate(req.body);
    if (error) {
      sendResponse(res, 400, { error: error.details[0].message });
      return;
    }

    const { courseId } = req.params;
    const updateData: Record<string, unknown> = {};

    if (value.title !== undefined) updateData.title = value.title;
    if (value.subheading !== undefined) updateData.subheading = value.subheading;
    if (value.about !== undefined) updateData.about = value.about;
    if (value.banner !== undefined) updateData.banner = value.banner;
    if (value.instructorId !== undefined) updateData.instructor = value.instructorId;
    if (value.status !== undefined) updateData.status = value.status;
    if (value.comingSoon !== undefined) updateData.comingSoon = value.comingSoon;
    if (value.releaseDate !== undefined) updateData.releaseDate = value.releaseDate;

    const course = await Course.findByIdAndUpdate(
      courseId,
      { $set: updateData },
      { new: true }
    ).populate({ path: 'instructor', select: 'firstName lastName title' });

    if (!course) {
      sendResponse(res, 404, { error: 'Course not found.' });
      return;
    }

    sendResponse(res, 200, { course, message: 'Course updated successfully.' });
  } catch (err) {
    console.error('[AdminUpdateCourse Error]', err);
    sendResponse(res, 500, { error: 'Internal server error.' });
  }
};

export const reorderCourses = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const { error, value } = reorderSchema.validate(req.body);
    if (error) {
      sendResponse(res, 400, { error: error.details[0].message });
      return;
    }

    const { order } = value;
    const updates = order.map((courseId: string, index: number) =>
      Course.findByIdAndUpdate(courseId, { order: index + 1 })
    );
    await Promise.all(updates);

    sendResponse(res, 200, { message: 'Courses reordered successfully.' });
  } catch (err) {
    console.error('[AdminReorderCourses Error]', err);
    sendResponse(res, 500, { error: 'Internal server error.' });
  }
};

export const deleteCourse = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      sendResponse(res, 404, { error: 'Course not found.' });
      return;
    }

    const lessons = await Lesson.find({ course: courseId });
    const lessonIds = lessons.map((l) => l._id);

    await Promise.all([
      LessonResource.deleteMany({ lesson: { $in: lessonIds } }),
      Lesson.deleteMany({ course: courseId }),
      Module.deleteMany({ course: courseId }),
      Course.findByIdAndDelete(courseId),
    ]);

    sendResponse(res, 200, { message: 'Course and all related content deleted.' });
  } catch (err) {
    console.error('[AdminDeleteCourse Error]', err);
    sendResponse(res, 500, { error: 'Internal server error.' });
  }
};

export const getCourseEditor = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId).populate({
      path: 'instructor',
      select: 'firstName lastName title bio photo',
    });

    if (!course) {
      sendResponse(res, 404, { error: 'Course not found.' });
      return;
    }

    const modules = await Module.find({ course: courseId }).sort({ order: 1 });

    const modulesWithLessons = await Promise.all(
      modules.map(async (mod) => {
        const lessons = await Lesson.find({ module: mod._id }).sort({ order: 1 });
        return { ...mod.toObject(), lessons: lessons.map((l) => l.toObject()) };
      })
    );

    sendResponse(res, 200, { course: course.toObject(), modules: modulesWithLessons });
  } catch (err) {
    console.error('[AdminGetCourseEditor Error]', err);
    sendResponse(res, 500, { error: 'Internal server error.' });
  }
};

// Module controllers
export const createModule = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const { error, value } = createModuleSchema.validate(req.body);
    if (error) {
      sendResponse(res, 400, { error: error.details[0].message });
      return;
    }

    const { courseId } = req.params;
    const count = await Module.countDocuments({ course: courseId });

    const module = await Module.create({
      course: courseId,
      title: value.title,
      order: count + 1,
    });

    sendResponse(res, 201, { module, message: 'Module created successfully.' });
  } catch (err) {
    console.error('[AdminCreateModule Error]', err);
    sendResponse(res, 500, { error: 'Internal server error.' });
  }
};

export const updateModule = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const { error, value } = updateModuleSchema.validate(req.body);
    if (error) {
      sendResponse(res, 400, { error: error.details[0].message });
      return;
    }

    const { moduleId } = req.params;
    const module = await Module.findByIdAndUpdate(
      moduleId,
      { $set: { title: value.title } },
      { new: true }
    );

    if (!module) {
      sendResponse(res, 404, { error: 'Module not found.' });
      return;
    }

    sendResponse(res, 200, { module, message: 'Module updated.' });
  } catch (err) {
    console.error('[AdminUpdateModule Error]', err);
    sendResponse(res, 500, { error: 'Internal server error.' });
  }
};

export const reorderModules = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const { error, value } = reorderSchema.validate(req.body);
    if (error) {
      sendResponse(res, 400, { error: error.details[0].message });
      return;
    }

    const updates = value.order.map((moduleId: string, index: number) =>
      Module.findByIdAndUpdate(moduleId, { order: index + 1 })
    );
    await Promise.all(updates);

    sendResponse(res, 200, { message: 'Modules reordered successfully.' });
  } catch (err) {
    console.error('[AdminReorderModules Error]', err);
    sendResponse(res, 500, { error: 'Internal server error.' });
  }
};

export const deleteModule = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const { moduleId } = req.params;

    const module = await Module.findById(moduleId);
    if (!module) {
      sendResponse(res, 404, { error: 'Module not found.' });
      return;
    }

    const lessons = await Lesson.find({ module: moduleId });
    const lessonIds = lessons.map((l) => l._id);

    await Promise.all([
      LessonResource.deleteMany({ lesson: { $in: lessonIds } }),
      Lesson.deleteMany({ module: moduleId }),
      Module.findByIdAndDelete(moduleId),
    ]);

    sendResponse(res, 200, { message: 'Module and lessons deleted.' });
  } catch (err) {
    console.error('[AdminDeleteModule Error]', err);
    sendResponse(res, 500, { error: 'Internal server error.' });
  }
};

// Lesson controllers
export const createLesson = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const { error, value } = createLessonSchema.validate(req.body);
    if (error) {
      sendResponse(res, 400, { error: error.details[0].message });
      return;
    }

    const { courseId, moduleId } = req.params;

    const module = await Module.findOne({ _id: moduleId, course: courseId });
    if (!module) {
      sendResponse(res, 404, { error: 'Module not found.' });
      return;
    }

    const count = await Lesson.countDocuments({ module: moduleId });

    const lesson = await Lesson.create({
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

    sendResponse(res, 201, { lesson, message: 'Lesson created successfully.' });
  } catch (err) {
    console.error('[AdminCreateLesson Error]', err);
    sendResponse(res, 500, { error: 'Internal server error.' });
  }
};

export const updateLesson = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const { error, value } = updateLessonSchema.validate(req.body);
    if (error) {
      sendResponse(res, 400, { error: error.details[0].message });
      return;
    }

    const { lessonId } = req.params;
    const updateData: Record<string, unknown> = {};

    if (value.title !== undefined) updateData.title = value.title;
    if (value.subheading !== undefined) updateData.subheading = value.subheading;
    if (value.videoEmbed !== undefined) updateData.videoEmbed = value.videoEmbed;
    if (value.status !== undefined) updateData.status = value.status;
    if (value.comingSoon !== undefined) updateData.comingSoon = value.comingSoon;
    if (value.releaseDate !== undefined) updateData.releaseDate = value.releaseDate;

    const lesson = await Lesson.findByIdAndUpdate(
      lessonId,
      { $set: updateData },
      { new: true }
    );

    if (!lesson) {
      sendResponse(res, 404, { error: 'Lesson not found.' });
      return;
    }

    sendResponse(res, 200, { lesson, message: 'Lesson updated.' });
  } catch (err) {
    console.error('[AdminUpdateLesson Error]', err);
    sendResponse(res, 500, { error: 'Internal server error.' });
  }
};

export const reorderLessons = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const { error, value } = reorderSchema.validate(req.body);
    if (error) {
      sendResponse(res, 400, { error: error.details[0].message });
      return;
    }

    const updates = value.order.map((lessonId: string, index: number) =>
      Lesson.findByIdAndUpdate(lessonId, { order: index + 1 })
    );
    await Promise.all(updates);

    sendResponse(res, 200, { message: 'Lessons reordered successfully.' });
  } catch (err) {
    console.error('[AdminReorderLessons Error]', err);
    sendResponse(res, 500, { error: 'Internal server error.' });
  }
};

export const deleteLesson = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const { lessonId } = req.params;

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      sendResponse(res, 404, { error: 'Lesson not found.' });
      return;
    }

    await Promise.all([
      LessonResource.deleteMany({ lesson: lessonId }),
      Lesson.findByIdAndDelete(lessonId),
    ]);

    sendResponse(res, 200, { message: 'Lesson and resources deleted.' });
  } catch (err) {
    console.error('[AdminDeleteLesson Error]', err);
    sendResponse(res, 500, { error: 'Internal server error.' });
  }
};
