import { Response, NextFunction } from 'express';
import { ExpressRequest } from '../types/types';
import { AdminSettings } from '../models/admin_settings.schema';
import { sendResponse } from '../utils/sendResponse';

export const maintenanceMiddleware = async (
  req: ExpressRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Skip maintenance check for auth routes
    if (req.path.startsWith('/api/auth') || req.originalUrl.startsWith('/api/auth')) {
      next();
      return;
    }

    // Admin users bypass maintenance mode
    if (req.user?.role === 'admin') {
      next();
      return;
    }

    const settings = await AdminSettings.findOne().lean();

    if (settings?.maintenanceMode) {
      sendResponse(res, 503, {
        error: settings.maintenanceMessage || 'Platform is under maintenance.',
      });
      return;
    }

    next();
  } catch (err) {
    // If we can't check maintenance status, allow through (fail-open)
    next();
  }
};
