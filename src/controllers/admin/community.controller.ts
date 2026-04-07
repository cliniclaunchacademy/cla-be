import { Response } from 'express';
import { ExpressRequest } from '../../types/types';
import { CommunityLink } from '../../models/community_link.schema';
import { sendResponse, sendError } from '../../utils/sendResponse';
import { uploadToCloudinary } from '../../utils/upload';
import {
  createCommunityLinkSchema,
  updateCommunityLinkSchema,
} from '../../validators/admin.validator';

export const getCommunityLinks = async (_req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const links = await CommunityLink.find().sort({ order: 1 });
    sendResponse(res, 200, { links });
  } catch (err) {
    console.error('[AdminGetCommunityLinks Error]', err);
    sendError(res, 500, 'Failed to load community links. Please try again.');
  }
};

export const createCommunityLink = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const { error, value } = createCommunityLinkSchema.validate(req.body);
    if (error) {
      sendError(res, 400, error.details[0].message);
      return;
    }

    if (value.order === undefined) {
      const count = await CommunityLink.countDocuments();
      value.order = count + 1;
    }

    const link = await CommunityLink.create(value);
    sendResponse(res, 201, { link, message: 'Community link created.' });
  } catch (err) {
    console.error('[AdminCreateCommunityLink Error]', err);
    sendError(res, 500, 'Failed to create community link. Please try again.');
  }
};

export const uploadCommunityLinkImage = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const { linkId } = req.params;

    if (!req.file) {
      sendError(res, 400, 'Please select an image file to upload.');
      return;
    }

    const imageUrl = await uploadToCloudinary(req.file.buffer, 'cla/community');
    const link = await CommunityLink.findByIdAndUpdate(
      linkId,
      { $set: { imageUrl } },
      { new: true }
    );

    if (!link) {
      sendError(res, 404, 'Community link not found.');
      return;
    }

    sendResponse(res, 200, { imageUrl, message: 'Image uploaded.' });
  } catch (err) {
    console.error('[AdminUploadCommunityLinkImage Error]', err);
    sendError(res, 500, 'Failed to upload image. Please try again.');
  }
};

export const updateCommunityLink = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const { error, value } = updateCommunityLinkSchema.validate(req.body);
    if (error) {
      sendError(res, 400, error.details[0].message);
      return;
    }

    const { linkId } = req.params;
    const link = await CommunityLink.findByIdAndUpdate(
      linkId,
      { $set: value },
      { new: true }
    );

    if (!link) {
      sendError(res, 404, 'Community link not found.');
      return;
    }

    sendResponse(res, 200, { link, message: 'Community link updated.' });
  } catch (err) {
    console.error('[AdminUpdateCommunityLink Error]', err);
    sendError(res, 500, 'Failed to update community link. Please try again.');
  }
};

export const deleteCommunityLink = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const { linkId } = req.params;

    const link = await CommunityLink.findByIdAndDelete(linkId);
    if (!link) {
      sendError(res, 404, 'Community link not found.');
      return;
    }

    sendResponse(res, 200, { message: 'Community link deleted.' });
  } catch (err) {
    console.error('[AdminDeleteCommunityLink Error]', err);
    sendError(res, 500, 'Failed to delete community link. Please try again.');
  }
};
