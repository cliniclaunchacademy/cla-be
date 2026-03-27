"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationReadSchema = exports.labApplySchema = exports.updateProfileSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.updateProfileSchema = joi_1.default.object({
    firstName: joi_1.default.string().trim().optional(),
    lastName: joi_1.default.string().trim().optional(),
    username: joi_1.default.string().trim().optional(),
});
exports.labApplySchema = joi_1.default.object({}).optional();
exports.notificationReadSchema = joi_1.default.object({}).optional();
//# sourceMappingURL=student.validator.js.map