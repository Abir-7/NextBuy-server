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
exports.UserService = void 0;
const prisma_1 = __importDefault(require("../../client/prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = require("../../config");
const jsonTokenGenerator_1 = require("../../utils/jsonTokenGenerator");
const createUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { address, email, password, mobile, name, accountType } = data;
    const hashedPass = yield bcrypt_1.default.hash(password, Number(config_1.config.saltRounds));
    const result = yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield prisma.user.create({
            data: {
                email: email,
                password: hashedPass,
                role: accountType,
            },
        });
        if (accountType === "CUSTOMER") {
            yield prisma.customer.create({
                data: {
                    email: user.email,
                    name,
                    mobile: Number(mobile),
                    address,
                    userId: user.userId,
                },
            });
        }
        if (accountType === "VENDOR") {
            yield prisma.vendor.create({
                data: {
                    email: user.email,
                    name,
                    mobile: Number(mobile),
                    address,
                    userId: user.userId,
                },
            });
        }
        yield prisma.user.findUnique({
            where: { email: user.email },
        });
        const token = (0, jsonTokenGenerator_1.tokenGenerator)({ userEmail: user.email, role: user.role });
        return token;
    }));
    return result;
});
exports.UserService = {
    createUser,
};
