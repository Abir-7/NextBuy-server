"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), ".env") });
exports.config = {
    port: process.env.PORT,
    saltRounds: process.env.SALTROUNDS,
    jwt_secrete_key: process.env.JWT_ACCESS_SECRET,
    jwt_secrete_date: process.env.JWT_ACCESS_EXPIRES_IN,
    Signature_Key: process.env.Signature_Key,
    Store_ID: process.env.Store_ID,
    Api_EndPoint: process.env.Api_EndPoint,
};
