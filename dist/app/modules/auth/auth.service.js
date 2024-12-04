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
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = __importDefault(require("../../client/prisma"));
const AppError_1 = require("../../Error/AppError");
const jsonTokenGenerator_1 = require("../../utils/jsonTokenGenerator");
const userLogin = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: { email: data.email },
    });
    if (!user) {
        throw new AppError_1.AppError(404, "Check your email");
    }
    if (!(yield bcrypt_1.default.compare(data.password, user.password))) {
        throw new AppError_1.AppError(404, "Check your password");
    }
    const token = (0, jsonTokenGenerator_1.tokenGenerator)({ userEmail: user.email, role: user.role });
    if (!token) {
        throw new AppError_1.AppError(404, "Something Went Wrong!! Try again.");
    }
    return { token };
});
exports.AuthService = {
    userLogin,
};