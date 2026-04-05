import { Response } from 'express';
import { ExpressRequest } from '../../types/types';
import { AdminSettings } from '../../models/admin_settings.schema';
import { sendResponse, sendError } from '../../utils/sendResponse';
import { saveSettingsSchema } from '../../validators/admin.validator';

export const getSettings = async (_req: ExpressRequest, res: Response): Promise<void> => {
  try {
    let settings = await AdminSettings.findOne();

    if (!settings) {
      settings = await AdminSettings.create({
        maintenanceMode: false,
      });
    }

    sendResponse(res, 200, { settings });
  } catch (err) {
    console.error('[AdminGetSettings Error]', err);
    sendError(res, 500, 'Failed to load settings. Please try again.');
  }
};

export const saveSettings = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const { error, value } = saveSettingsSchema.validate(req.body);
    if (error) {
      sendError(res, 400, error.details[0].message);
      return;
    }

    const settings = await AdminSettings.findOneAndUpdate(
      {},
      { $set: { ...value, updatedAt: new Date() } },
      { upsert: true, new: true }
    );

    sendResponse(res, 200, { settings, message: 'Settings saved successfully.' });
  } catch (err) {
    console.error('[AdminSaveSettings Error]', err);
    sendError(res, 500, 'Failed to save settings. Please try again.');
  }
};
