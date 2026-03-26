import { Request, Response } from 'express';
import { Instructor } from '../../models/instructor.schema';
import { Course } from '../../models/course.schema';
import { sendResponse } from '../../utils/sendResponse';
import { getFileUrl } from '../../utils/upload';
import {
  createInstructorSchema,
  updateInstructorSchema,
} from '../../validators/admin.validator';

export const getInstructors = async (_req: Request, res: Response): Promise<void> => {
  try {
    const instructors = await Instructor.find().sort({ createdAt: -1 });

    const instructorsWithCount = await Promise.all(
      instructors.map(async (instructor) => {
        const coursesAssigned = await Course.countDocuments({ instructor: instructor._id });
        return { ...instructor.toObject(), coursesAssigned };
      })
    );

    sendResponse(res, 200, { instructors: instructorsWithCount });
  } catch (err) {
    console.error('[AdminGetInstructors Error]', err);
    sendResponse(res, 500, { error: 'Internal server error.' });
  }
};

export const createInstructor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { error, value } = createInstructorSchema.validate(req.body);
    if (error) {
      sendResponse(res, 400, { error: error.details[0].message });
      return;
    }

    const instructor = await Instructor.create(value);
    sendResponse(res, 201, { instructor, message: 'Instructor created successfully.' });
  } catch (err) {
    console.error('[AdminCreateInstructor Error]', err);
    sendResponse(res, 500, { error: 'Internal server error.' });
  }
};

export const uploadInstructorPhoto = async (req: Request, res: Response): Promise<void> => {
  try {
    const { instructorId } = req.params;

    if (!req.file) {
      sendResponse(res, 400, { error: 'No image file provided.' });
      return;
    }

    const photoUrl = getFileUrl(req.file.filename);
    const instructor = await Instructor.findByIdAndUpdate(
      instructorId,
      { $set: { photo: photoUrl } },
      { new: true }
    );

    if (!instructor) {
      sendResponse(res, 404, { error: 'Instructor not found.' });
      return;
    }

    sendResponse(res, 200, { photo: photoUrl, message: 'Instructor photo updated.' });
  } catch (err) {
    console.error('[AdminUploadInstructorPhoto Error]', err);
    sendResponse(res, 500, { error: 'Internal server error.' });
  }
};

export const updateInstructor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { error, value } = updateInstructorSchema.validate(req.body);
    if (error) {
      sendResponse(res, 400, { error: error.details[0].message });
      return;
    }

    const { instructorId } = req.params;

    const instructor = await Instructor.findByIdAndUpdate(
      instructorId,
      { $set: value },
      { new: true }
    );

    if (!instructor) {
      sendResponse(res, 404, { error: 'Instructor not found.' });
      return;
    }

    sendResponse(res, 200, { instructor, message: 'Instructor updated.' });
  } catch (err) {
    console.error('[AdminUpdateInstructor Error]', err);
    sendResponse(res, 500, { error: 'Internal server error.' });
  }
};

export const deleteInstructor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { instructorId } = req.params;

    const instructor = await Instructor.findById(instructorId);
    if (!instructor) {
      sendResponse(res, 404, { error: 'Instructor not found.' });
      return;
    }

    // Block if assigned to non-draft courses
    const activeCourse = await Course.findOne({
      instructor: instructorId,
      status: { $ne: 'draft' },
    });

    if (activeCourse) {
      sendResponse(res, 400, {
        error: 'Cannot delete instructor assigned to published or unpublished courses.',
      });
      return;
    }

    await Instructor.findByIdAndDelete(instructorId);
    sendResponse(res, 200, { message: 'Instructor deleted.' });
  } catch (err) {
    console.error('[AdminDeleteInstructor Error]', err);
    sendResponse(res, 500, { error: 'Internal server error.' });
  }
};
