"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../../config");
const prisma_1 = __importDefault(require("../../client/prisma"));
const AppError_1 = require("../../Error/AppError");
const tryCatch_1 = __importDefault(require("../../utils/tryCatch"));
const auth = (...userRole) => {
    return (0, tryCatch_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const tokenData = req.headers.authorization;
        const token = tokenData;
        if (!token) {
            throw new AppError_1.AppError(401, "You have no access to this route1");
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, config_1.config.jwt_secrete_key);
            const { role, userEmail } = decoded;
            const user = yield prisma_1.default.user.findUnique({
                where: { email: userEmail },
            });
            //check user exixt or not
            if (!user) {
                throw new AppError_1.AppError(401, "You have no access to this route2", "");
            }
            if (userRole && !userRole.includes(role)) {
                throw new AppError_1.AppError(401, "You have no access to this route3", "");
            }
            req.user = decoded;
            next();
        }
        catch (error) {
            throw new AppError_1.AppError(401, "You have no access to this route");
        }
    }));
};
exports.auth = auth;
