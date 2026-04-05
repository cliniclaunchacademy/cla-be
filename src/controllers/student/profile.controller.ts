import { Response } from 'express';
import { ExpressRequest } from '../../types/types';
import { User } from '../../models/user.schema';
import { sendResponse, sendError } from '../../utils/sendResponse';
import { updateProfileSchema } from '../../validators/student.validator';
import { uploadToCloudinary } from '../../utils/upload';

export const getMe = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user!._id).select('-password -resetToken -resetTokenExpiry');
    if (!user) {
      sendError(res, 404, 'User not found.');
      return;
    }
    sendResponse(res, 200, { user });
  } catch (err) {
    console.error('[GetMe Error]', err);
    sendError(res, 500, 'Failed to load profile. Please try again.');
  }
};

export const updateProfile = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const { error, value } = updateProfileSchema.validate(req.body);
    if (error) {
      sendError(res, 400, error.details[0].message);
      return;
    }

    const { firstName, lastName, username } = value;

    if (username) {
      const existing = await User.findOne({ username, _id: { $ne: req.user!._id } });
      if (existing) {
        sendError(res, 400, 'This username is already taken. Please choose a different one.');
        return;
      }
    }

    const updateData: Record<string, string> = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (username) updateData.username = username;

    const user = await User.findByIdAndUpdate(
      req.user!._id,
      { $set: updateData },
      { new: true }
    ).select('-password -resetToken -resetTokenExpiry');

    sendResponse(res, 200, { user, message: 'Profile updated successfully.' });
  } catch (err) {
    console.error('[UpdateProfile Error]', err);
    sendError(res, 500, 'Failed to update profile. Please try again.');
  }
};

export const uploadProfilePhoto = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      sendError(res, 400, 'Please select an image file to upload.');
      return;
    }

    const photoUrl = await uploadToCloudinary(req.file.buffer, 'cla/profile-photos');

    await User.findByIdAndUpdate(req.user!._id, { profilePhoto: photoUrl });

    sendResponse(res, 200, { profilePhoto: photoUrl, message: 'Profile photo updated.' });
  } catch (err) {
    console.error('[UploadProfilePhoto Error]', err);
    sendError(res, 500, 'Failed to upload profile photo. Please try again.');
  }
};
