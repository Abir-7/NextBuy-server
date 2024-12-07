"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.tokenGenerator = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const AppError_1 = require("../Error/AppError");
const tokenGenerator = (data, expiresIn = config_1.config.jwt_secrete_date) => {
    const token = jsonwebtoken_1.default.sign(data, config_1.config.jwt_secrete_key, {
        expiresIn: expiresIn,
    });
    return token;
};
exports.tokenGenerator = tokenGenerator;
const verifyToken = (token) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.config.jwt_secrete_key);
        return decoded;
    }
    catch (error) {
        // Handle JWT-specific errors
        throw new AppError_1.AppError(401, "Invalid or expired token");
    }
};
exports.verifyToken = verifyToken;
