"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.login = void 0;
const crypto_1 = __importDefault(require("crypto"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_schema_1 = require("../models/user.schema");
const activity_log_schema_1 = require("../models/activity_log.schema");
const sendResponse_1 = require("../utils/sendResponse");
const email_1 = require("../utils/email");
const auth_validator_1 = require("../validators/auth.validator");
const login = async (req, res) => {
    try {
        const { error, value } = auth_validator_1.loginSchema.validate(req.body);
        if (error) {
            (0, sendResponse_1.sendResponse)(res, 400, { error: error.details[0].message });
            return;
        }
        const { email, password } = value;
        const user = await user_schema_1.User.findOne({ email }).select('+password');
        if (!user) {
            (0, sendResponse_1.sendResponse)(res, 401, { error: 'Incorrect email or password.' });
            return;
        }
        if (user.status === 'banned') {
            (0, sendResponse_1.sendResponse)(res, 403, { error: 'Your account has been suspended.' });
            return;
        }
        if (user.status === 'inactive') {
            (0, sendResponse_1.sendResponse)(res, 403, { error: 'Your account is inactive. Please contact support.' });
            return;
        }
        if (!user.is_whitelisted) {
            (0, sendResponse_1.sendResponse)(res, 403, { error: 'Your account is not authorized to access this platform.' });
            return;
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            (0, sendResponse_1.sendResponse)(res, 401, { error: 'Incorrect email or password.' });
            return;
        }
        user.lastLogin = new Date();
        await user.save();
        await activity_log_schema_1.ActivityLog.create({
            user: user._id,
            action: 'login',
        });
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            (0, sendResponse_1.sendResponse)(res, 500, { error: 'Server configuration error.' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ _id: user._id.toString(), role: user.role }, secret, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
        const userObj = user.toObject();
        delete userObj.password;
        delete userObj.resetToken;
        delete userObj.resetTokenExpiry;
        (0, sendResponse_1.sendResponse)(res, 200, { token, user: userObj });
    }
    catch (err) {
        console.error('[Login Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.login = login;
const forgotPassword = async (req, res) => {
    try {
        const { error, value } = auth_validator_1.forgotPasswordSchema.validate(req.body);
        if (error) {
            (0, sendResponse_1.sendResponse)(res, 400, { error: error.details[0].message });
            return;
        }
        const { email } = value;
        const successMessage = 'If this email is registered, a reset link has been sent.';
        const user = await user_schema_1.User.findOne({ email });
        if (!user) {
            (0, sendResponse_1.sendResponse)(res, 200, { message: successMessage });
            return;
        }
        const rawToken = crypto_1.default.randomBytes(32).toString('hex');
        const hashedToken = crypto_1.default.createHash('sha256').update(rawToken).digest('hex');
        const expiry = new Date(Date.now() + 60 * 60 * 1000);
        user.resetToken = hashedToken;
        user.resetTokenExpiry = expiry;
        await user.save();
        await (0, email_1.sendPasswordResetEmail)(user.email, rawToken);
        (0, sendResponse_1.sendResponse)(res, 200, { message: successMessage });
    }
    catch (err) {
        console.error('[ForgotPassword Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (req, res) => {
    try {
        const { error, value } = auth_validator_1.resetPasswordSchema.validate(req.body);
        if (error) {
            (0, sendResponse_1.sendResponse)(res, 400, { error: error.details[0].message });
            return;
        }
        const { token, password, confirmPassword } = value;
        if (password !== confirmPassword) {
            (0, sendResponse_1.sendResponse)(res, 400, { error: 'Passwords do not match.' });
            return;
        }
        const hashedToken = crypto_1.default.createHash('sha256').update(token).digest('hex');
        const user = await user_schema_1.User.findOne({
            resetToken: hashedToken,
            resetTokenExpiry: { $gt: new Date() },
        });
        if (!user) {
            (0, sendResponse_1.sendResponse)(res, 400, { error: 'Reset link is invalid or has expired.' });
            return;
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        user.password = await bcryptjs_1.default.hash(password, salt);
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();
        (0, sendResponse_1.sendResponse)(res, 200, { message: 'Password updated. Please log in.' });
    }
    catch (err) {
        console.error('[ResetPassword Error]', err);
        (0, sendResponse_1.sendResponse)(res, 500, { error: 'Internal server error.' });
    }
};
exports.resetPassword = resetPassword;
//# sourceMappingURL=auth.controller.js.map