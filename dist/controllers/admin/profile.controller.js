"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadAdminProfilePhoto = exports.updateAdminProfile = exports.getAdminMe = void 0;
const user_schema_1 = require("../../models/user.schema");
const sendResponse_1 = require("../../utils/sendResponse");
const upload_1 = require("../../utils/upload");
const admin_validator_1 = require("../../validators/admin.validator");
const getAdminMe = async (req, res) => {
    try {
        const user = await user_schema_1.User.findById(req.user._id).select('-password -resetToken -resetTokenExpiry');
        if (!user) {
            (0, sendResponse_1.sendResponse)(res, 404, { error: 'User not found.' });
            return;
        }
        (0, sendResponse_1.sendResponse)(res, 200, { user });
    }
    catch (err) {
        console.error('[AdminGetMe Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.getAdminMe = getAdminMe;
const updateAdminProfile = async (req, res) => {
    try {
        const { error, value } = admin_validator_1.updateAdminProfileSchema.validate(req.body);
        if (error) {
            (0, sendResponse_1.sendResponse)(res, 400, { error: error.details[0].message });
            return;
        }
        const { firstName, lastName, username } = value;
        if (username) {
            const existing = await user_schema_1.User.findOne({ username, _id: { $ne: req.user._id } });
            if (existing) {
                (0, sendResponse_1.sendResponse)(res, 400, { error: 'Username is already taken.' });
                return;
            }
        }
        const updateData = {};
        if (firstName)
            updateData.firstName = firstName;
        if (lastName)
            updateData.lastName = lastName;
        if (username)
            updateData.username = username;
        const user = await user_schema_1.User.findByIdAndUpdate(req.user._id, { $set: updateData }, { new: true }).select('-password -resetToken -resetTokenExpiry');
        (0, sendResponse_1.sendResponse)(res, 200, { user, message: 'Profile updated successfully.' });
    }
    catch (err) {
        console.error('[AdminUpdateProfile Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.updateAdminProfile = updateAdminProfile;
const uploadAdminProfilePhoto = async (req, res) => {
    try {
        if (!req.file) {
            (0, sendResponse_1.sendResponse)(res, 400, { error: 'No image file provided.' });
            return;
        }
        const photoUrl = await (0, upload_1.uploadToCloudinary)(req.file.buffer, 'cla/profile-photos');
        await user_schema_1.User.findByIdAndUpdate(req.user._id, { profilePhoto: photoUrl });
        (0, sendResponse_1.sendResponse)(res, 200, { profilePhoto: photoUrl, message: 'Profile photo updated.' });
    }
    catch (err) {
        console.error('[AdminUploadProfilePhoto Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.uploadAdminProfilePhoto = uploadAdminProfilePhoto;
//# sourceMappingURL=profile.controller.js.map