"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.maintenanceMiddleware = void 0;
const admin_settings_schema_1 = require("../models/admin_settings.schema");
const sendResponse_1 = require("../utils/sendResponse");
const maintenanceMiddleware = async (req, res, next) => {
    try {
        if (req.path.startsWith('/api/auth') || req.originalUrl.startsWith('/api/auth')) {
            next();
            return;
        }
        if (req.user?.role === 'admin') {
            next();
            return;
        }
        const settings = await admin_settings_schema_1.AdminSettings.findOne().lean();
        if (settings?.maintenanceMode) {
            (0, sendResponse_1.sendResponse)(res, 503, {
                error: settings.maintenanceMessage || 'Platform is under maintenance.',
            });
            return;
        }
        next();
    }
    catch (err) {
        next();
    }
};
exports.maintenanceMiddleware = maintenanceMiddleware;
//# sourceMappingURL=maintenance.middleware.js.map