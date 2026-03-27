import { Response } from 'express';
import { ExpressRequest } from '../../types/types';
import { AdminSettings } from '../../models/admin_settings.schema';
import { sendResponse } from '../../utils/sendResponse';
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
    sendResponse(res, 500, { error: 'Internal server error.' });
  }
};

export const saveSettings = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const { error, value } = saveSettingsSchema.validate(req.body);
    if (error) {
      sendResponse(res, 400, { error: error.details[0].message });
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
    sendResponse(res, 500, { error: 'Internal server error.' });
  }
};
