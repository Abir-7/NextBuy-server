"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = (err, req, res, next) => {
    const statusCode = 400;
    const message = (err === null || err === void 0 ? void 0 : err.message) || "Something Went Wrong";
    console.log(err);
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        err,
    });
};
exports.default = errorHandler;
