"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBanner = exports.reorderBanners = exports.updateBanner = exports.createBanner = exports.getActiveBanners = exports.getBanners = void 0;
const banner_schema_1 = require("../../models/banner.schema");
const sendResponse_1 = require("../../utils/sendResponse");
const upload_1 = require("../../utils/upload");
const admin_validator_1 = require("../../validators/admin.validator");
const getBanners = async (_req, res) => {
    try {
        const banners = await banner_schema_1.Banner.find().sort({ order: 1 });
        (0, sendResponse_1.sendResponse)(res, 200, { banners });
    }
    catch (err) {
        console.error('[AdminGetBanners Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.getBanners = getBanners;
const getActiveBanners = async (_req, res) => {
    try {
        const banners = await banner_schema_1.Banner.find({ status: 'active' }).sort({ order: 1 });
        (0, sendResponse_1.sendResponse)(res, 200, { banners });
    }
    catch (err) {
        console.error('[AdminGetActiveBanners Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.getActiveBanners = getActiveBanners;
const createBanner = async (req, res) => {
    try {
        if (!req.file) {
            (0, sendResponse_1.sendResponse)(res, 400, { error: 'No image file provided.' });
            return;
        }
        const { error, value } = admin_validator_1.uploadBannerSchema.validate(req.body);
        if (error) {
            (0, sendResponse_1.sendResponse)(res, 400, { error: error.details[0].message });
            return;
        }
        const imageUrl = await (0, upload_1.uploadToCloudinary)(req.file.buffer, 'cla/dashboard-carousel');
        const count = await banner_schema_1.Banner.countDocuments();
        const banner = await banner_schema_1.Banner.create({
            imageUrl,
            label: value.label,
            status: 'active',
            order: count + 1,
        });
        (0, sendResponse_1.sendResponse)(res, 201, { banner, message: 'Banner created.' });
    }
    catch (err) {
        console.error('[AdminCreateBanner Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.createBanner = createBanner;
const updateBanner = async (req, res) => {
    try {
        const { error, value } = admin_validator_1.updateBannerSchema.validate(req.body);
        if (error) {
            (0, sendResponse_1.sendResponse)(res, 400, { error: error.details[0].message });
            return;
        }
        const { bannerId } = req.params;
        const banner = await banner_schema_1.Banner.findByIdAndUpdate(bannerId, { $set: value }, { new: true });
        if (!banner) {
            (0, sendResponse_1.sendResponse)(res, 404, { error: 'Banner not found.' });
            return;
        }
        (0, sendResponse_1.sendResponse)(res, 200, { banner, message: 'Banner updated.' });
    }
    catch (err) {
        console.error('[AdminUpdateBanner Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.updateBanner = updateBanner;
const reorderBanners = async (req, res) => {
    try {
        const { error, value } = admin_validator_1.reorderSchema.validate(req.body);
        if (error) {
            (0, sendResponse_1.sendResponse)(res, 400, { error: error.details[0].message });
            return;
        }
        const updates = value.order.map((bannerId, index) => banner_schema_1.Banner.findByIdAndUpdate(bannerId, { order: index + 1 }));
        await Promise.all(updates);
        (0, sendResponse_1.sendResponse)(res, 200, { message: 'Banners reordered.' });
    }
    catch (err) {
        console.error('[AdminReorderBanners Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.reorderBanners = reorderBanners;
const deleteBanner = async (req, res) => {
    try {
        const { bannerId } = req.params;
        const banner = await banner_schema_1.Banner.findByIdAndDelete(bannerId);
        if (!banner) {
            (0, sendResponse_1.sendResponse)(res, 404, { error: 'Banner not found.' });
            return;
        }
        (0, sendResponse_1.sendResponse)(res, 200, { message: 'Banner deleted.' });
    }
    catch (err) {
        console.error('[AdminDeleteBanner Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.deleteBanner = deleteBanner;
//# sourceMappingURL=banners.controller.js.map