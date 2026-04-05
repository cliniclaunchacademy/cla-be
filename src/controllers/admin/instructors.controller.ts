import { Response } from 'express';
import { ExpressRequest } from '../../types/types';
import { Instructor } from '../../models/instructor.schema';
import { Course } from '../../models/course.schema';
import { sendResponse, sendError } from '../../utils/sendResponse';
import { uploadToCloudinary } from '../../utils/upload';
import {
  createInstructorSchema,
  updateInstructorSchema,
} from '../../validators/admin.validator';

export const getInstructors = async (_req: ExpressRequest, res: Response): Promise<void> => {
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
    sendError(res, 500, 'Failed to load instructors. Please try again.');
  }
};

export const createInstructor = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const { error, value } = createInstructorSchema.validate(req.body);
    if (error) {
      sendError(res, 400, error.details[0].message);
      return;
    }

    const instructor = await Instructor.create(value);
    sendResponse(res, 201, { instructor, message: 'Instructor created successfully.' });
  } catch (err) {
    console.error('[AdminCreateInstructor Error]', err);
    sendError(res, 500, 'Failed to create instructor. Please try again.');
  }
};

export const uploadInstructorPhoto = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const { instructorId } = req.params;

    if (!req.file) {
      sendError(res, 400, 'Please select an image file to upload.');
      return;
    }

    const photoUrl = await uploadToCloudinary(req.file.buffer, 'cla/instructors');
    const instructor = await Instructor.findByIdAndUpdate(
      instructorId,
      { $set: { photo: photoUrl } },
      { new: true }
    );

    if (!instructor) {
      sendError(res, 404, 'Instructor not found.');
      return;
    }

    sendResponse(res, 200, { photo: photoUrl, message: 'Instructor photo updated.' });
  } catch (err) {
    console.error('[AdminUploadInstructorPhoto Error]', err);
    sendError(res, 500, 'Failed to upload instructor photo. Please try again.');
  }
};

export const updateInstructor = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const { error, value } = updateInstructorSchema.validate(req.body);
    if (error) {
      sendError(res, 400, error.details[0].message);
      return;
    }

    const { instructorId } = req.params;

    const instructor = await Instructor.findByIdAndUpdate(
      instructorId,
      { $set: value },
      { new: true }
    );

    if (!instructor) {
      sendError(res, 404, 'Instructor not found.');
      return;
    }

    sendResponse(res, 200, { instructor, message: 'Instructor updated.' });
  } catch (err) {
    console.error('[AdminUpdateInstructor Error]', err);
    sendError(res, 500, 'Failed to update instructor. Please try again.');
  }
};

export const deleteInstructor = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const { instructorId } = req.params;

    const instructor = await Instructor.findById(instructorId);
    if (!instructor) {
      sendError(res, 404, 'Instructor not found.');
      return;
    }

    // Block if assigned to non-draft courses
    const activeCourse = await Course.findOne({
      instructor: instructorId,
      status: { $ne: 'draft' },
    });

    if (activeCourse) {
      sendError(res, 400, 'This instructor is assigned to one or more active courses. Please reassign those courses before deleting this instructor.');
      return;
    }

    await Instructor.findByIdAndDelete(instructorId);
    sendResponse(res, 200, { message: 'Instructor deleted.' });
  } catch (err) {
    console.error('[AdminDeleteInstructor Error]', err);
    sendError(res, 500, 'Failed to delete instructor. Please try again.');
  }
};
