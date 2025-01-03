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
exports.AuthController = void 0;
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const tryCatch_1 = __importDefault(require("../../utils/tryCatch"));
const auth_service_1 = require("./auth.service");
const userLogin = (0, tryCatch_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.AuthService.userLogin(req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Welcome Back.",
        data: result,
    });
}));
const resetPassLink = (0, tryCatch_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userEmail = req.body.email;
    const result = yield auth_service_1.AuthService.userResetPassLinkGenarator(userEmail);
    (0, sendResponse_1.default)(res, {
        data: { token: result },
        statusCode: 200,
        success: true,
        message: "Reset link sent",
    });
}));
exports.AuthController = {
    userLogin,
    resetPassLink,
};
