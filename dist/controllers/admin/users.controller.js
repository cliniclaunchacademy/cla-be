"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.resendWelcomeEmail = exports.unbanUser = exports.banUser = exports.updateUser = exports.createUser = exports.getUsers = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const user_schema_1 = require("../../models/user.schema");
const progress_schema_1 = require("../../models/progress.schema");
const activity_log_schema_1 = require("../../models/activity_log.schema");
const sendResponse_1 = require("../../utils/sendResponse");
const email_1 = require("../../utils/email");
const admin_validator_1 = require("../../validators/admin.validator");
const getUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        const { search, role, status } = req.query;
        const filter = {};
        if (search) {
            filter.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { username: { $regex: search, $options: 'i' } },
            ];
        }
        if (role)
            filter.role = role;
        if (status)
            filter.status = status;
        const [users, total] = await Promise.all([
            user_schema_1.User.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .select('-password -resetToken -resetTokenExpiry'),
            user_schema_1.User.countDocuments(filter),
        ]);
        (0, sendResponse_1.sendResponse)(res, 200, {
            users,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        });
    }
    catch (err) {
        console.error('[AdminGetUsers Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.getUsers = getUsers;
const createUser = async (req, res) => {
    try {
        const { error, value } = admin_validator_1.createUserSchema.validate(req.body);
        if (error) {
            (0, sendResponse_1.sendResponse)(res, 400, { error: error.details[0].message });
            return;
        }
        const { username, email, firstName, lastName, password, role, sendWelcomeEmail: shouldSendEmail } = value;
        const existingEmail = await user_schema_1.User.findOne({ email });
        if (existingEmail) {
            (0, sendResponse_1.sendResponse)(res, 400, { error: 'Email is already registered.' });
            return;
        }
        const existingUsername = await user_schema_1.User.findOne({ username });
        if (existingUsername) {
            (0, sendResponse_1.sendResponse)(res, 400, { error: 'Username is already taken.' });
            return;
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        const user = await user_schema_1.User.create({
            username,
            email,
            firstName,
            lastName,
            password: hashedPassword,
            role,
            status: 'active',
            is_whitelisted: true,
        });
        if (shouldSendEmail) {
            try {
                await (0, email_1.sendWelcomeEmail)(email, firstName, lastName, password);
                await user_schema_1.User.findByIdAndUpdate(user._id, { welcomeEmailSent: true });
            }
            catch (emailErr) {
                console.error('[SendWelcomeEmail Error]', emailErr instanceof Error ? emailErr.message : emailErr);
            }
        }
        const userObj = user.toObject();
        delete userObj.password;
        delete userObj.resetToken;
        delete userObj.resetTokenExpiry;
        (0, sendResponse_1.sendResponse)(res, 201, { user: userObj, message: 'User created successfully.' });
    }
    catch (err) {
        console.error('[AdminCreateUser Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.createUser = createUser;
const updateUser = async (req, res) => {
    try {
        const { error, value } = admin_validator_1.editUserSchema.validate(req.body);
        if (error) {
            (0, sendResponse_1.sendResponse)(res, 400, { error: error.details[0].message });
            return;
        }
        const { userId } = req.params;
        const { username, firstName, lastName, email, role, password, status } = value;
        const user = await user_schema_1.User.findById(userId);
        if (!user) {
            (0, sendResponse_1.sendResponse)(res, 404, { error: 'User not found.' });
            return;
        }
        if (username && username !== user.username) {
            const existing = await user_schema_1.User.findOne({ username, _id: { $ne: userId } });
            if (existing) {
                (0, sendResponse_1.sendResponse)(res, 400, { error: 'Username is already taken.' });
                return;
            }
        }
        if (email && email !== user.email) {
            const existing = await user_schema_1.User.findOne({ email, _id: { $ne: userId } });
            if (existing) {
                (0, sendResponse_1.sendResponse)(res, 400, { error: 'Email is already registered.' });
                return;
            }
        }
        const updateData = {};
        if (username)
            updateData.username = username;
        if (firstName)
            updateData.firstName = firstName;
        if (lastName)
            updateData.lastName = lastName;
        if (email)
            updateData.email = email;
        if (role)
            updateData.role = role;
        if (status)
            updateData.status = status;
        if (password) {
            const salt = await bcryptjs_1.default.genSalt(10);
            updateData.password = await bcryptjs_1.default.hash(password, salt);
        }
        const updated = await user_schema_1.User.findByIdAndUpdate(userId, { $set: updateData }, { new: true }).select('-password -resetToken -resetTokenExpiry');
        (0, sendResponse_1.sendResponse)(res, 200, { user: updated, message: 'User updated successfully.' });
    }
    catch (err) {
        console.error('[AdminUpdateUser Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.updateUser = updateUser;
const banUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await user_schema_1.User.findByIdAndUpdate(userId, { $set: { status: 'banned' } }, { new: true }).select('-password -resetToken -resetTokenExpiry');
        if (!user) {
            (0, sendResponse_1.sendResponse)(res, 404, { error: 'User not found.' });
            return;
        }
        (0, sendResponse_1.sendResponse)(res, 200, { user, message: 'User has been banned.' });
    }
    catch (err) {
        console.error('[AdminBanUser Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.banUser = banUser;
const unbanUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await user_schema_1.User.findByIdAndUpdate(userId, { $set: { status: 'active' } }, { new: true }).select('-password -resetToken -resetTokenExpiry');
        if (!user) {
            (0, sendResponse_1.sendResponse)(res, 404, { error: 'User not found.' });
            return;
        }
        (0, sendResponse_1.sendResponse)(res, 200, { user, message: 'User has been unbanned.' });
    }
    catch (err) {
        console.error('[AdminUnbanUser Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.unbanUser = unbanUser;
const resendWelcomeEmail = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await user_schema_1.User.findById(userId);
        if (!user) {
            (0, sendResponse_1.sendResponse)(res, 404, { error: 'User not found.' });
            return;
        }
        const resetToken = crypto_1.default.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);
        await user_schema_1.User.findByIdAndUpdate(userId, { resetToken, resetTokenExpiry, welcomeEmailSent: true });
        await (0, email_1.sendWelcomeSetPasswordEmail)(user.email, user.firstName, user.lastName, resetToken);
        (0, sendResponse_1.sendResponse)(res, 200, { message: 'Welcome email sent.' });
    }
    catch (err) {
        console.error('[AdminResendWelcomeEmail Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.resendWelcomeEmail = resendWelcomeEmail;
const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await user_schema_1.User.findById(userId);
        if (!user) {
            (0, sendResponse_1.sendResponse)(res, 404, { error: 'User not found.' });
            return;
        }
        await Promise.all([
            user_schema_1.User.findByIdAndDelete(userId),
            progress_schema_1.Progress.deleteMany({ user: userId }),
            activity_log_schema_1.ActivityLog.deleteMany({ user: userId }),
        ]);
        (0, sendResponse_1.sendResponse)(res, 200, { message: 'User deleted successfully.' });
    }
    catch (err) {
        console.error('[AdminDeleteUser Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.deleteUser = deleteUser;
//# sourceMappingURL=users.controller.js.map