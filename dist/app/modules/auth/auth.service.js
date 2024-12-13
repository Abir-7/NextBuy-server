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
const nodeMailer_1 = require("../../utils/nodeMailer");
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
    if (user.isBlocked) {
        throw new AppError_1.AppError(404, "User blocked");
    }
    if (user.isDeleted) {
        throw new AppError_1.AppError(404, "User deleted");
    }
    const token = (0, jsonTokenGenerator_1.tokenGenerator)({ userEmail: user.email, role: user.role });
    if (!token) {
        throw new AppError_1.AppError(404, "Something Went Wrong!! Try again.");
    }
    return { token };
});
const userResetPassLinkGenarator = (userEmail) => __awaiter(void 0, void 0, void 0, function* () {
    const findUser = yield prisma_1.default.user.findUnique({
        where: { email: userEmail },
    });
    if (!findUser) {
        throw new AppError_1.AppError(500, "User not found");
    }
    const accessToken = (0, jsonTokenGenerator_1.tokenGenerator)({
        userEmail: userEmail,
        role: "",
    }, "5min");
    // { to, subject, text, html }
    yield (0, nodeMailer_1.sendMail)({
        to: userEmail,
        subject: "Reset pass link",
        text: "Change your pass within 5min",
        html: `<a href="http://localhost:3000/reset-password?email=${userEmail}&token=${accessToken}">Reset Link</a>
  <p>Change your pass within 5min</p>`,
    });
    return "";
});
exports.AuthService = {
    userLogin,
    userResetPassLinkGenarator,
};
