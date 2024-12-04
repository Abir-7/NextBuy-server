"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenGenerator = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const tokenGenerator = (data) => {
    const token = jsonwebtoken_1.default.sign(data, config_1.config.jwt_secrete_key, {
        expiresIn: config_1.config.jwt_secrete_date,
    });
    return token;
};
exports.tokenGenerator = tokenGenerator;
