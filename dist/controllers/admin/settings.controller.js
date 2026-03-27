"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveSettings = exports.getSettings = void 0;
const admin_settings_schema_1 = require("../../models/admin_settings.schema");
const sendResponse_1 = require("../../utils/sendResponse");
const admin_validator_1 = require("../../validators/admin.validator");
const getSettings = async (_req, res) => {
    try {
        let settings = await admin_settings_schema_1.AdminSettings.findOne();
        if (!settings) {
            settings = await admin_settings_schema_1.AdminSettings.create({
                maintenanceMode: false,
            });
        }
        (0, sendResponse_1.sendResponse)(res, 200, { settings });
    }
    catch (err) {
        console.error('[AdminGetSettings Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.getSettings = getSettings;
const saveSettings = async (req, res) => {
    try {
        const { error, value } = admin_validator_1.saveSettingsSchema.validate(req.body);
        if (error) {
            (0, sendResponse_1.sendResponse)(res, 400, { error: error.details[0].message });
            return;
        }
        const settings = await admin_settings_schema_1.AdminSettings.findOneAndUpdate({}, { $set: { ...value, updatedAt: new Date() } }, { upsert: true, new: true });
        (0, sendResponse_1.sendResponse)(res, 200, { settings, message: 'Settings saved successfully.' });
    }
    catch (err) {
        console.error('[AdminSaveSettings Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.saveSettings = saveSettings;
//# sourceMappingURL=settings.controller.js.map