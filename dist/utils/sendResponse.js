"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = void 0;
const sendResponse = (res, status, data) => {
    console.log(`[Response ${status}]`, JSON.stringify(data));
    return res.status(status).json(data);
};
exports.sendResponse = sendResponse;
//# sourceMappingURL=sendResponse.js.map