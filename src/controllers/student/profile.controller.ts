import { Response } from 'express';
import { ExpressRequest } from '../../types/types';
import { User } from '../../models/user.schema';
import { sendResponse } from '../../utils/sendResponse';
import { updateProfileSchema } from '../../validators/student.validator';
import { uploadToCloudinary } from '../../utils/upload';

export const getMe = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user!._id).select('-password -resetToken -resetTokenExpiry');
    if (!user) {
      sendResponse(res, 404, { error: 'User not found.' });
      return;
    }
    sendResponse(res, 200, { user });
  } catch (err) {
    console.error('[GetMe Error]', err);
    sendResponse(res, 500, { error: 'Internal server error.' });
  }
};

export const updateProfile = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const { error, value } = updateProfileSchema.validate(req.body);
    if (error) {
      sendResponse(res, 400, { error: error.details[0].message });
      return;
    }

    const { firstName, lastName, username } = value;

    if (username) {
      const existing = await User.findOne({ username, _id: { $ne: req.user!._id } });
      if (existing) {
        sendResponse(res, 400, { error: 'Username is already taken.' });
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
    sendResponse(res, 500, { error: 'Internal server error.' });
  }
};

export const uploadProfilePhoto = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      sendResponse(res, 400, { error: 'No image file provided.' });
      return;
    }

    const photoUrl = await uploadToCloudinary(req.file.buffer, 'cla/profile-photos');

    await User.findByIdAndUpdate(req.user!._id, { profilePhoto: photoUrl });

    sendResponse(res, 200, { profilePhoto: photoUrl, message: 'Profile photo updated.' });
  } catch (err) {
    console.error('[UploadProfilePhoto Error]', err);
    sendResponse(res, 500, { error: 'Internal server error.' });
  }
};
