import { Response } from 'express';
import { ExpressRequest } from '../../types/types';
import mongoose from 'mongoose';
import { LabPartner } from '../../models/lab_partner.schema';
import { LabApplication } from '../../models/lab_application.schema';
import { sendResponse } from '../../utils/sendResponse';

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
    sendResponse(res, 500, { error: 'Internal server error.' });
  }
};

export const applyToLab = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const { labId } = req.params;
    const userId = new mongoose.Types.ObjectId(req.user!._id);

    const lab = await LabPartner.findById(labId);
    if (!lab) {
      sendResponse(res, 404, { error: 'Lab not found.' });
      return;
    }

    const existingApplication = await LabApplication.findOne({ user: userId, lab: labId });
    if (existingApplication) {
      sendResponse(res, 400, { error: 'You have already applied to this lab.' });
      return;
    }

    const application = await LabApplication.create({
      user: userId,
      lab: labId,
      status: 'pending',
      appliedAt: new Date(),
    });

    sendResponse(res, 201, {
      applicationId: application._id,
      status: 'pending',
      appliedAt: application.appliedAt,
    });
  } catch (err) {
    console.error('[ApplyToLab Error]', err);
    sendResponse(res, 500, { error: 'Internal server error.' });
  }
};
