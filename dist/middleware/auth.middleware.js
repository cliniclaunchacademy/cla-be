"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sendResponse_1 = require("../utils/sendResponse");
const authenticate = (role) => {
    return (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                (0, sendResponse_1.sendResponse)(res, 401, { error: 'No token provided. Authorization denied.' });
                return;
            }
            const token = authHeader.split(' ')[1];
            const secret = process.env.JWT_SECRET;
            if (!secret) {
                (0, sendResponse_1.sendResponse)(res, 500, { error: 'JWT secret not configured.' });
                return;
            }
            const decoded = jsonwebtoken_1.default.verify(token, secret);
            if (role && decoded.role !== role) {
                (0, sendResponse_1.sendResponse)(res, 403, { error: 'Access denied. Insufficient permissions.' });
                return;
            }
            req.user = {
                _id: decoded._id,
                role: decoded.role,
            };
            next();
        }
        catch (err) {
            if (err instanceof jsonwebtoken_1.default.TokenExpiredError) {
                (0, sendResponse_1.sendResponse)(res, 401, { error: 'Token has expired. Please log in again.' });
            }
            else if (err instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                (0, sendResponse_1.sendResponse)(res, 401, { error: 'Invalid token. Authorization denied.' });
            }
            else {
                (0, sendResponse_1.sendResponse)(res, 401, { error: 'Authentication failed.' });
            }
        }
    };
};
exports.authenticate = authenticate;
//# sourceMappingURL=auth.middleware.js.map