import { Response } from 'express';
import { ExpressRequest } from '../../types/types';
import { CommunityLink } from '../../models/community_link.schema';
import { sendResponse } from '../../utils/sendResponse';

export const getCommunityLinks = async (_req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const links = await CommunityLink.find({ active: true })
      .sort({ order: 1 })
      .select('imageUrl discord');

    sendResponse(res, 200, { links });
  } catch (err) {
    console.error('[GetCommunityLinks Error]', err);
    sendResponse(res, 500, { error: 'Internal server error.' });
  }
};
