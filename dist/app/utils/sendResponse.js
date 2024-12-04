"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendResponse = (res, data) => {
    res.status(data.statusCode).send({
        success: data.success,
        statusCode: data.statusCode,
        message: data.message,
        data: data.data,
    });
};
exports.default = sendResponse;
