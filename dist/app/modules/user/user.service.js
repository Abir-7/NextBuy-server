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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
const paginationHelper_1 = require("../../utils/paginationHelper");
const AppError_1 = require("../../Error/AppError");
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
const getAllUser = (paginationData, params) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(paginationData);
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    let andCondtion = [];
    if (Object.keys(filterData).length > 0) {
        andCondtion.push({
            AND: Object.keys(filterData)
                .filter((field) => Boolean(filterData[field])) // Exclude all falsy values
                .map((field) => {
                const value = filterData[field] === "true"
                    ? true
                    : filterData[field] === "false"
                        ? false
                        : filterData[field];
                return {
                    [field]: {
                        equals: value,
                        // mode: "insensitive", // Uncomment if needed for case-insensitive search
                    },
                };
            }),
        });
    }
    const searchField = ["email"];
    if (params.searchTerm) {
        andCondtion.push({
            OR: searchField.map((field) => ({
                [field]: { contains: params.searchTerm, mode: "insensitive" },
            })),
        });
    }
    const whereConditons = { AND: andCondtion };
    andCondtion.push({
        AND: [{ isDeleted: false }, { role: { not: "SUPERADMIN" } }],
    });
    const result = yield prisma_1.default.user.findMany({
        where: whereConditons,
        select: {
            userId: true,
            email: true,
            role: true,
            isBlocked: true,
            Admin: true,
            vendor: true,
            customer: true,
        },
        skip: skip,
        take: limit,
        orderBy: (paginationData === null || paginationData === void 0 ? void 0 : paginationData.sort)
            ? {
                [paginationData.sort.split("-")[0]]: paginationData.sort.split("-")[1],
            }
            : {
                createdAt: "desc",
            },
    });
    const total = yield prisma_1.default.user.count({ where: whereConditons });
    return {
        meta: { page, limit, total, totalPage: Math.ceil(total / limit) },
        data: result,
    };
});
const userBlock = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const previous = yield prisma_1.default.user.findUnique({
        where: {
            userId: id,
        },
    });
    const result = yield prisma_1.default.user.update({
        where: { userId: id },
        data: { isBlocked: !(previous === null || previous === void 0 ? void 0 : previous.isBlocked) },
        select: { isBlocked: true },
    });
    return result;
});
const userDelete = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const previous = yield prisma_1.default.user.findUnique({
        where: {
            userId: id,
        },
    });
    const result = yield prisma_1.default.user.update({
        where: { userId: id },
        data: { isDeleted: !(previous === null || previous === void 0 ? void 0 : previous.isDeleted) },
        select: { isDeleted: true },
    });
    return result;
});
const setUserNewPassword = (token, password) => __awaiter(void 0, void 0, void 0, function* () {
    // Use the utility to decode the token
    const decoded = (0, jsonTokenGenerator_1.verifyToken)(token);
    const isUserExist = yield prisma_1.default.user.findUnique({
        where: { email: decoded.userEmail },
    });
    if (!isUserExist) {
        throw new AppError_1.AppError(404, "User not Found");
    }
    const hashedPassword = yield bcrypt_1.default.hash(password, Number(config_1.config.saltRounds));
    const result = yield prisma_1.default.user.update({
        where: { email: decoded.userEmail },
        data: { password: hashedPassword },
    });
    return result;
});
const changePassword = (userData, password) => __awaiter(void 0, void 0, void 0, function* () {
    const hashedPassword = yield bcrypt_1.default.hash(password.password, Number(config_1.config.saltRounds));
    const result = yield prisma_1.default.user.update({
        where: { email: userData.userEmail },
        data: { password: hashedPassword },
    });
    return result;
});
const userInfo = (userEmail) => __awaiter(void 0, void 0, void 0, function* () {
    let userInfo = null;
    const user = yield prisma_1.default.user.findUnique({ where: { email: userEmail } });
    if (!user) {
        return userInfo;
    }
    if (user.role == "CUSTOMER") {
        const cstomer = yield prisma_1.default.customer.findUnique({
            where: { email: user.email },
            include: { user: { select: { role: true } } },
        });
        userInfo = cstomer;
    }
    if (user.role == "VENDOR") {
        const vendor = yield prisma_1.default.vendor.findUnique({
            where: { email: user.email },
            include: { user: { select: { role: true } } },
        });
        userInfo = vendor;
    }
    return userInfo;
});
exports.UserService = {
    createUser,
    setUserNewPassword,
    getAllUser,
    userBlock,
    userDelete,
    changePassword,
    userInfo,
};
