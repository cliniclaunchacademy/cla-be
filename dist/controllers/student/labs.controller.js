"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyToLab = exports.getLabs = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const lab_partner_schema_1 = require("../../models/lab_partner.schema");
const lab_application_schema_1 = require("../../models/lab_application.schema");
const sendResponse_1 = require("../../utils/sendResponse");
const getLabs = async (req, res) => {
    try {
        const userId = new mongoose_1.default.Types.ObjectId(req.user._id);
        const labs = await lab_partner_schema_1.LabPartner.find().sort({ order: 1 });
        const labsWithApplicationStatus = await Promise.all(labs.map(async (lab) => {
            const application = await lab_application_schema_1.LabApplication.findOne({ user: userId, lab: lab._id });
            return {
                ...lab.toObject(),
                applicationStatus: application?.status || null,
                rejectionReason: application?.rejectionReason || null,
                applicationId: application?._id || null,
            };
        }));
        (0, sendResponse_1.sendResponse)(res, 200, { labs: labsWithApplicationStatus });
    }
    catch (err) {
        console.error('[GetLabs Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.getLabs = getLabs;
const applyToLab = async (req, res) => {
    try {
        const { labId } = req.params;
        const userId = new mongoose_1.default.Types.ObjectId(req.user._id);
        const lab = await lab_partner_schema_1.LabPartner.findById(labId);
        if (!lab) {
            (0, sendResponse_1.sendResponse)(res, 404, { error: 'Lab not found.' });
            return;
        }
        const existingApplication = await lab_application_schema_1.LabApplication.findOne({ user: userId, lab: labId });
        if (existingApplication) {
            (0, sendResponse_1.sendResponse)(res, 400, { error: 'You have already applied to this lab.' });
            return;
        }
        const application = await lab_application_schema_1.LabApplication.create({
            user: userId,
            lab: labId,
            status: 'pending',
            appliedAt: new Date(),
        });
        (0, sendResponse_1.sendResponse)(res, 201, {
            applicationId: application._id,
            status: 'pending',
            appliedAt: application.appliedAt,
        });
    }
    catch (err) {
        console.error('[ApplyToLab Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.applyToLab = applyToLab;
//# sourceMappingURL=labs.controller.js.map