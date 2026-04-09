import { Response } from 'express';
import { ExpressRequest } from '../../types/types';
import mongoose from 'mongoose';
import { LabPartner } from '../../models/lab_partner.schema';
import { LabApplication } from '../../models/lab_application.schema';
import { sendResponse, sendError } from '../../utils/sendResponse';

// Applications are submitted via GHL form → POST /api/webhooks/ghl/lab-application
// This controller only handles reading lab data + the student's application status

export const getLabs = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user!._id);

    const labs = await LabPartner.find().sort({ order: 1 });

    const labsWithApplicationStatus = await Promise.all(
      labs.map(async (lab) => {
        const application = await LabApplication.findOne({ user: userId, lab: lab._id });
        return {
          ...lab.toObject(),
          applicationStatus: application?.status || null,
          rejectionReason: application?.rejectionReason || null,
          applicationId: application?._id || null,
        };
      })
    );

    sendResponse(res, 200, { labs: labsWithApplicationStatus });
  } catch (err) {
    console.error('[GetLabs Error]', err);
    sendError(res, 500, 'Failed to load lab partners. Please try again.');
  }
};
