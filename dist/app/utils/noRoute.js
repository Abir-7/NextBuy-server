"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const noRoute = (req, res, next) => {
    res.status(404).json({
        status: false,
        statusCode: 404,
        message: "Route not found",
    });
};
exports.default = noRoute;
