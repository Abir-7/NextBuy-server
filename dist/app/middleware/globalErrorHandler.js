"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const AppError_1 = require("../Error/AppError");
const errorHandler = (err, req, res, next) => {
    var _a, _b;
    let statusCode = 500; // Default to internal server error
    let message = "Something went wrong"; // Default message
    let errorDetails = err; // Default error details
    if (err instanceof AppError_1.AppError) {
        // Handle custom AppError
        statusCode = err.statusCode;
        message = err.message;
        errorDetails = err;
    }
    else if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        // Handle known Prisma errors
        statusCode = 400;
        if (err.code === "P2002") {
            // Unique constraint violation
            const fields = Array.isArray((_a = err.meta) === null || _a === void 0 ? void 0 : _a.target)
                ? ((_b = err.meta) === null || _b === void 0 ? void 0 : _b.target).join(", ")
                : "field";
            message = `Duplicate value for ${fields}.`;
        }
        else if (err.code === "P2025") {
            // Record not found
            message = "The requested record was not found.";
        }
        else {
            message = "A database error occurred.";
        }
        errorDetails = {
            code: err.code,
            meta: err.meta,
        };
    }
    else if (err instanceof client_1.Prisma.PrismaClientValidationError) {
        // Handle Prisma validation errors
        statusCode = 400;
        message = "Validation error occurred. Check your input.";
    }
    else if (err instanceof Error) {
        // Handle general JavaScript errors
        message = err.message || "Internal Server Error";
        if (process.env.NODE_ENV === "development") {
            errorDetails = { stack: err.stack };
        }
    }
    console.log(err);
    // Send response in desired structure
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        err: errorDetails,
    });
};
exports.default = errorHandler;
