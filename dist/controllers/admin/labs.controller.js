"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateApplicationStatus = exports.getLabApplicationDetail = exports.getLabApplications = exports.reorderLabs = exports.deleteLab = exports.updateLab = exports.uploadLabLogo = exports.createLab = exports.getLabs = void 0;
const lab_partner_schema_1 = require("../../models/lab_partner.schema");
const lab_application_schema_1 = require("../../models/lab_application.schema");
const sendResponse_1 = require("../../utils/sendResponse");
const upload_1 = require("../../utils/upload");
const admin_validator_1 = require("../../validators/admin.validator");
const getLabs = async (_req, res) => {
    try {
        const labs = await lab_partner_schema_1.LabPartner.find().sort({ order: 1 });
        const labsWithCount = await Promise.all(labs.map(async (lab) => {
            const totalApplications = await lab_application_schema_1.LabApplication.countDocuments({ lab: lab._id });
            return { ...lab.toObject(), totalApplications };
        }));
        (0, sendResponse_1.sendResponse)(res, 200, { labs: labsWithCount });
    }
    catch (err) {
        console.error('[AdminGetLabs Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.getLabs = getLabs;
const createLab = async (req, res) => {
    try {
        const { error, value } = admin_validator_1.createLabSchema.validate(req.body);
        if (error) {
            (0, sendResponse_1.sendResponse)(res, 400, { error: error.details[0].message });
            return;
        }
        const count = await lab_partner_schema_1.LabPartner.countDocuments();
        const lab = await lab_partner_schema_1.LabPartner.create({ ...value, order: count + 1 });
        (0, sendResponse_1.sendResponse)(res, 201, { lab, message: 'Lab partner created.' });
    }
    catch (err) {
        console.error('[AdminCreateLab Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.createLab = createLab;
const uploadLabLogo = async (req, res) => {
    try {
        const { labId } = req.params;
        if (!req.file) {
            (0, sendResponse_1.sendResponse)(res, 400, { error: 'No image file provided.' });
            return;
        }
        const logoUrl = await (0, upload_1.uploadToCloudinary)(req.file.buffer, 'cla/lab-logos');
        const lab = await lab_partner_schema_1.LabPartner.findByIdAndUpdate(labId, { $set: { logo: logoUrl } }, { new: true });
        if (!lab) {
            (0, sendResponse_1.sendResponse)(res, 404, { error: 'Lab not found.' });
            return;
        }
        (0, sendResponse_1.sendResponse)(res, 200, { logo: logoUrl, message: 'Logo uploaded.' });
    }
    catch (err) {
        console.error('[AdminUploadLabLogo Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.uploadLabLogo = uploadLabLogo;
const updateLab = async (req, res) => {
    try {
        const { error, value } = admin_validator_1.updateLabSchema.validate(req.body);
        if (error) {
            (0, sendResponse_1.sendResponse)(res, 400, { error: error.details[0].message });
            return;
        }
        const { labId } = req.params;
        const lab = await lab_partner_schema_1.LabPartner.findByIdAndUpdate(labId, { $set: value }, { new: true });
        if (!lab) {
            (0, sendResponse_1.sendResponse)(res, 404, { error: 'Lab not found.' });
            return;
        }
        (0, sendResponse_1.sendResponse)(res, 200, { lab, message: 'Lab updated.' });
    }
    catch (err) {
        console.error('[AdminUpdateLab Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.updateLab = updateLab;
const deleteLab = async (req, res) => {
    try {
        const { labId } = req.params;
        const lab = await lab_partner_schema_1.LabPartner.findById(labId);
        if (!lab) {
            (0, sendResponse_1.sendResponse)(res, 404, { error: 'Lab not found.' });
            return;
        }
        await Promise.all([
            lab_application_schema_1.LabApplication.deleteMany({ lab: labId }),
            lab_partner_schema_1.LabPartner.findByIdAndDelete(labId),
        ]);
        (0, sendResponse_1.sendResponse)(res, 200, { message: 'Lab and applications deleted.' });
    }
    catch (err) {
        console.error('[AdminDeleteLab Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.deleteLab = deleteLab;
const reorderLabs = async (req, res) => {
    try {
        const { error, value } = admin_validator_1.reorderSchema.validate(req.body);
        if (error) {
            (0, sendResponse_1.sendResponse)(res, 400, { error: error.details[0].message });
            return;
        }
        const updates = value.order.map((labId, index) => lab_partner_schema_1.LabPartner.findByIdAndUpdate(labId, { order: index + 1 }));
        await Promise.all(updates);
        (0, sendResponse_1.sendResponse)(res, 200, { message: 'Labs reordered.' });
    }
    catch (err) {
        console.error('[AdminReorderLabs Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.reorderLabs = reorderLabs;
const getLabApplications = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        const { lab, status, search, from, to } = req.query;
        const filter = {};
        if (lab)
            filter.lab = lab;
        if (status)
            filter.status = status;
        if (from || to) {
            const dateFilter = {};
            if (from)
                dateFilter.$gte = new Date(from);
            if (to)
                dateFilter.$lte = new Date(to);
            filter.appliedAt = dateFilter;
        }
        let query = lab_application_schema_1.LabApplication.find(filter)
            .populate({ path: 'user', select: 'firstName lastName email username profilePhoto' })
            .populate({ path: 'lab', select: 'name logo status' })
            .populate({ path: 'reviewedBy', select: 'firstName lastName email' })
            .sort({ appliedAt: -1 });
        if (search) {
            const apps = await lab_application_schema_1.LabApplication.find(filter)
                .populate({ path: 'user', select: 'firstName lastName email username' })
                .populate({ path: 'lab', select: 'name logo status' });
            const filtered = apps.filter((app) => {
                const user = app.user;
                if (!user)
                    return false;
                const searchLower = search.toLowerCase();
                return (user.firstName?.toLowerCase().includes(searchLower) ||
                    user.lastName?.toLowerCase().includes(searchLower) ||
                    user.email?.toLowerCase().includes(searchLower) ||
                    user.username?.toLowerCase().includes(searchLower));
            });
            const total = filtered.length;
            const paginated = filtered.slice(skip, skip + limit);
            (0, sendResponse_1.sendResponse)(res, 200, {
                applications: paginated,
                pagination: { page, limit, total, pages: Math.ceil(total / limit) },
            });
            return;
        }
        const [applications, total] = await Promise.all([
            query.skip(skip).limit(limit),
            lab_application_schema_1.LabApplication.countDocuments(filter),
        ]);
        (0, sendResponse_1.sendResponse)(res, 200, {
            applications,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        });
    }
    catch (err) {
        console.error('[AdminGetLabApplications Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.getLabApplications = getLabApplications;
const getLabApplicationDetail = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const application = await lab_application_schema_1.LabApplication.findById(applicationId)
            .populate({ path: 'user', select: 'firstName lastName email username profilePhoto' })
            .populate({ path: 'lab', select: 'name logo status portalUrl applicationEmbed' })
            .populate({ path: 'reviewedBy', select: 'firstName lastName email' });
        if (!application) {
            (0, sendResponse_1.sendResponse)(res, 404, { error: 'Application not found.' });
            return;
        }
        (0, sendResponse_1.sendResponse)(res, 200, { application });
    }
    catch (err) {
        console.error('[AdminGetLabApplicationDetail Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.getLabApplicationDetail = getLabApplicationDetail;
const updateApplicationStatus = async (req, res) => {
    try {
        const { error, value } = admin_validator_1.updateApplicationStatusSchema.validate(req.body);
        if (error) {
            (0, sendResponse_1.sendResponse)(res, 400, { error: error.details[0].message });
            return;
        }
        const { applicationId } = req.params;
        const { status, rejectionReason } = value;
        const updateData = {
            status,
            reviewedAt: new Date(),
            reviewedBy: req.user._id,
        };
        if (status === 'rejected' && rejectionReason) {
            updateData.rejectionReason = rejectionReason;
        }
        const application = await lab_application_schema_1.LabApplication.findByIdAndUpdate(applicationId, { $set: updateData }, { new: true })
            .populate({ path: 'user', select: 'firstName lastName email' })
            .populate({ path: 'lab', select: 'name' });
        if (!application) {
            (0, sendResponse_1.sendResponse)(res, 404, { error: 'Application not found.' });
            return;
        }
        (0, sendResponse_1.sendResponse)(res, 200, { application, message: 'Application status updated.' });
    }
    catch (err) {
        console.error('[AdminUpdateApplicationStatus Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.updateApplicationStatus = updateApplicationStatus;
//# sourceMappingURL=labs.controller.js.map