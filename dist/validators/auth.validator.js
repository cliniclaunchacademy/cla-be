"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.loginSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.loginSchema = joi_1.default.object({
    email: joi_1.default.string().email().required().messages({
        'string.email': 'Please provide a valid email address.',
        'any.required': 'Email is required.',
    }),
    password: joi_1.default.string().required().messages({
        'any.required': 'Password is required.',
    }),
});
exports.forgotPasswordSchema = joi_1.default.object({
    email: joi_1.default.string().email().required().messages({
        'string.email': 'Please provide a valid email address.',
        'any.required': 'Email is required.',
    }),
});
exports.resetPasswordSchema = joi_1.default.object({
    token: joi_1.default.string().required().messages({
        'any.required': 'Reset token is required.',
    }),
    password: joi_1.default.string().min(8).required().messages({
        'string.min': 'Password must be at least 8 characters.',
        'any.required': 'Password is required.',
    }),
    confirmPassword: joi_1.default.string().valid(joi_1.default.ref('password')).required().messages({
        'any.only': 'Passwords do not match.',
        'any.required': 'Confirm password is required.',
    }),
});
//# sourceMappingURL=auth.validator.js.map