import { Response } from 'express';
import { ExpressRequest } from '../../types/types';
import { LabPartner } from '../../models/lab_partner.schema';
import { LabApplication } from '../../models/lab_application.schema';
import { sendResponse, sendError } from '../../utils/sendResponse';
import { uploadToCloudinary } from '../../utils/upload';
import {
  createLabSchema,
  updateLabSchema,
  reorderSchema,
  updateApplicationStatusSchema,
  bulkUpdateApplicationStatusSchema,
} from '../../validators/admin.validator';

export const getLabs = async (_req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const labs = await LabPartner.find().sort({ order: 1 });

    const labsWithCount = await Promise.all(
      labs.map(async (lab) => {
        const totalApplications = await LabApplication.countDocuments({ lab: lab._id });
        return { ...lab.toObject(), totalApplications };
      })
    );

    sendResponse(res, 200, { labs: labsWithCount });
  } catch (err) {
    console.error('[AdminGetLabs Error]', err);
    sendError(res, 500, 'Failed to load lab partners. Please try again.');
  }
};

export const createLab = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const { error, value } = createLabSchema.validate(req.body);
    if (error) {
      sendError(res, 400, error.details[0].message);
      return;
    }

    const count = await LabPartner.countDocuments();
    const lab = await LabPartner.create({ ...value, order: count + 1 });

    sendResponse(res, 201, { lab, message: 'Lab partner created.' });
  } catch (err) {
    console.error('[AdminCreateLab Error]', err);
    sendError(res, 500, 'Failed to create lab partner. Please try again.');
  }
};

export const uploadLabLogo = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const { labId } = req.params;

    if (!req.file) {
      sendError(res, 400, 'Please select an image file to upload.');
      return;
    }

    const logoUrl = await uploadToCloudinary(req.file.buffer, 'cla/lab-logos');
    const lab = await LabPartner.findByIdAndUpdate(labId, { $set: { logo: logoUrl } }, { new: true });

    if (!lab) {
      sendError(res, 404, 'Lab partner not found.');
      return;
    }

    sendResponse(res, 200, { logo: logoUrl, message: 'Logo uploaded.' });
  } catch (err) {
    console.error('[AdminUploadLabLogo Error]', err);
    sendError(res, 500, 'Failed to upload lab logo. Please try again.');
  }
};

export const updateLab = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const { error, value } = updateLabSchema.validate(req.body);
    if (error) {
      sendError(res, 400, error.details[0].message);
      return;
    }

    const { labId } = req.params;
    const lab = await LabPartner.findByIdAndUpdate(labId, { $set: value }, { new: true });

    if (!lab) {
      sendError(res, 404, 'Lab partner not found.');
      return;
    }

    sendResponse(res, 200, { lab, message: 'Lab updated.' });
  } catch (err) {
    console.error('[AdminUpdateLab Error]', err);
    sendError(res, 500, 'Failed to update lab partner. Please try again.');
  }
};

export const deleteLab = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const { labId } = req.params;

    const lab = await LabPartner.findById(labId);
    if (!lab) {
      sendError(res, 404, 'Lab partner not found.');
      return;
    }

    await Promise.all([
      LabApplication.deleteMany({ lab: labId }),
      LabPartner.findByIdAndDelete(labId),
    ]);

    sendResponse(res, 200, { message: 'Lab and applications deleted.' });
  } catch (err) {
    console.error('[AdminDeleteLab Error]', err);
    sendError(res, 500, 'Failed to delete lab partner. Please try again.');
  }
};

export const reorderLabs = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const { error, value } = reorderSchema.validate(req.body);
    if (error) {
      sendError(res, 400, error.details[0].message);
      return;
    }

    const updates = value.order.map((labId: string, index: number) =>
      LabPartner.findByIdAndUpdate(labId, { order: index + 1 })
    );
    await Promise.all(updates);

    sendResponse(res, 200, { message: 'Labs reordered.' });
  } catch (err) {
    console.error('[AdminReorderLabs Error]', err);
    sendError(res, 500, 'Failed to reorder lab partners. Please try again.');
  }
};

export const getLabApplications = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;
    const { lab, status, search, from, to } = req.query;

    const filter: Record<string, unknown> = {};
    if (lab) filter.lab = lab;
    if (status) filter.status = status;

    if (from || to) {
      const dateFilter: Record<string, Date> = {};
      if (from) dateFilter.$gte = new Date(from as string);
      if (to) dateFilter.$lte = new Date(to as string);
      filter.appliedAt = dateFilter;
    }

    let query = LabApplication.find(filter)
      .populate({ path: 'user', select: 'firstName lastName email username profilePhoto' })
      .populate({ path: 'lab', select: 'name logo status' })
      .populate({ path: 'reviewedBy', select: 'firstName lastName email' })
      .sort({ appliedAt: -1 });

    // Search on user fields requires different approach
    if (search) {
      const apps = await LabApplication.find(filter)
        .populate({ path: 'user', select: 'firstName lastName email username' })
        .populate({ path: 'lab', select: 'name logo status' });

      const filtered = apps.filter((app) => {
        const user = app.user as { firstName?: string; lastName?: string; email?: string; username?: string } | null;
        if (!user) return false;
        const searchLower = (search as string).toLowerCase();
        return (
          user.firstName?.toLowerCase().includes(searchLower) ||
          user.lastName?.toLowerCase().includes(searchLower) ||
          user.email?.toLowerCase().includes(searchLower) ||
          user.username?.toLowerCase().includes(searchLower)
        );
      });

      const total = filtered.length;
      const paginated = filtered.slice(skip, skip + limit);

      sendResponse(res, 200, {
        applications: paginated,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      });
      return;
    }

    const [applications, total] = await Promise.all([
      query.skip(skip).limit(limit),
      LabApplication.countDocuments(filter),
    ]);

    sendResponse(res, 200, {
      applications,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error('[AdminGetLabApplications Error]', err);
    sendError(res, 500, 'Failed to load lab applications. Please try again.');
  }
};

export const getLabApplicationDetail = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const { applicationId } = req.params;

    const application = await LabApplication.findById(applicationId)
      .populate({ path: 'user', select: 'firstName lastName email username profilePhoto' })
      .populate({ path: 'lab', select: 'name logo status portalUrl applicationEmbed' })
      .populate({ path: 'reviewedBy', select: 'firstName lastName email' });

    if (!application) {
      sendError(res, 404, 'Application not found.');
      return;
    }

    sendResponse(res, 200, { application });
  } catch (err) {
    console.error('[AdminGetLabApplicationDetail Error]', err);
    sendError(res, 500, 'Failed to load application details. Please try again.');
  }
};

export const updateApplicationStatus = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const { error, value } = updateApplicationStatusSchema.validate(req.body);
    if (error) {
      sendError(res, 400, error.details[0].message);
      return;
    }

    const { applicationId } = req.params;
    const { status, rejectionReason } = value;

    const updateData: Record<string, unknown> = {
      status,
      reviewedAt: new Date(),
      reviewedBy: req.user!._id,
    };

    if (status === 'rejected' && rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }

    const application = await LabApplication.findByIdAndUpdate(
      applicationId,
      { $set: updateData },
      { new: true }
    )
      .populate({ path: 'user', select: 'firstName lastName email' })
      .populate({ path: 'lab', select: 'name' });

    if (!application) {
      sendError(res, 404, 'Application not found.');
      return;
    }

    sendResponse(res, 200, { application, message: 'Application status updated.' });
  } catch (err) {
    console.error('[AdminUpdateApplicationStatus Error]', err);
    sendError(res, 500, 'Failed to update application status. Please try again.');
  }
};

export const bulkUpdateApplicationStatus = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const { error, value } = bulkUpdateApplicationStatusSchema.validate(req.body);
    if (error) {
      sendError(res, 400, error.details[0].message);
      return;
    }

    const { applicationIds, status, rejectionReason } = value;

    const updateData: Record<string, unknown> = {
      status,
      reviewedAt: new Date(),
      reviewedBy: req.user!._id,
    };

    if (status === 'rejected' && rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }

    const result = await LabApplication.updateMany(
      { _id: { $in: applicationIds } },
      { $set: updateData }
    );

    sendResponse(res, 200, {
      updatedCount: result.modifiedCount,
      message: `${result.modifiedCount} application(s) updated to "${status}".`,
    });
  } catch (err) {
    console.error('[AdminBulkUpdateApplicationStatus Error]', err);
    sendError(res, 500, 'Failed to bulk update application statuses. Please try again.');
  }
};
