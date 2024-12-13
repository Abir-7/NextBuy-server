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
exports.ShopService = void 0;
const prisma_1 = __importDefault(require("../../client/prisma"));
const AppError_1 = require("../../Error/AppError");
const paginationHelper_1 = require("../../utils/paginationHelper");
const createShop = (data, user) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.vendor.findUnique({
        where: { email: user === null || user === void 0 ? void 0 : user.userEmail },
    });
    if (!userData) {
        throw new AppError_1.AppError(404, "Failed to create Shop. User not found.");
    }
    const result = yield prisma_1.default.shop.create({
        data: Object.assign(Object.assign({}, data), { vendorId: userData.vendorId }),
    });
    return result;
});
// for all
const getAllVendorShop = (paginationData, params) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(paginationData);
    const andCondtion = [];
    const searchField = ["name"];
    if (params.searchTerm) {
        andCondtion.push({
            OR: searchField.map((field) => ({
                [field]: { contains: params.searchTerm, mode: "insensitive" },
            })),
        });
    }
    andCondtion.push({ isBlackListed: false });
    const whereConditons = { AND: andCondtion };
    const result = yield prisma_1.default.shop.findMany({
        where: whereConditons,
        include: { vendor: true, followers: true },
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
    const total = yield prisma_1.default.shop.count();
    return {
        meta: { page, limit, total, totalPage: Math.ceil(total / limit) },
        data: result,
    };
});
const getSingleVendorShop = (id, paginationData) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(paginationData);
    //let andCondtion: Prisma.ShopWhereInput[] = [];
    // const searchField = ["description", "name"];
    // if (params.searchTerm) {
    //   andCondtion.push({
    //     OR: searchField.map((field) => ({
    //       [field]: { contains: params.searchTerm as string, mode: "insensitive" },
    //     })),
    //   });
    // }
    const result = yield prisma_1.default.shop.findUnique({
        where: {
            shopId: id,
        },
        include: {
            products: {
                include: { category: true },
                skip: skip,
                take: limit,
                orderBy: (paginationData === null || paginationData === void 0 ? void 0 : paginationData.sort)
                    ? {
                        [paginationData.sort.split("-")[0]]: paginationData.sort.split("-")[1],
                    }
                    : {
                        createdAt: "desc",
                    },
            },
            followers: { include: { customer: { select: { email: true } } } },
        },
    });
    const total = yield prisma_1.default.product.count({
        where: { shopId: id },
    });
    return {
        result,
        meta: {
            page,
            limit,
            total,
            totalPage: Math.ceil(total / limit),
        },
    };
});
//for vendor
const getVendorShop = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.vendor.findUnique({
        where: { email: user === null || user === void 0 ? void 0 : user.userEmail },
    });
    const result = yield prisma_1.default.shop.findMany({
        where: { vendorId: userData === null || userData === void 0 ? void 0 : userData.vendorId },
    });
    return result;
});
const getVendorSingleShop = (user, id, paginationData) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(paginationData);
    const data = yield prisma_1.default.vendor.findUniqueOrThrow({
        where: { email: user === null || user === void 0 ? void 0 : user.userEmail },
    });
    const result = yield prisma_1.default.shop.findFirst({
        where: { shopId: id, vendorId: data.vendorId },
        include: {
            products: {
                include: { category: true },
                skip: skip,
                take: limit,
                orderBy: (paginationData === null || paginationData === void 0 ? void 0 : paginationData.sort)
                    ? {
                        [paginationData.sort.split("-")[0]]: paginationData.sort.split("-")[1],
                    }
                    : {
                        createdAt: "desc",
                    },
            },
        },
    });
    const total = yield prisma_1.default.product.count({
        where: { shopId: id },
    });
    return {
        result,
        meta: {
            page,
            limit,
            total,
            totalPage: Math.ceil(total / limit),
        },
    };
});
const blockShop = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const previous = yield prisma_1.default.shop.findUnique({
        where: {
            shopId: id,
        },
    });
    const result = yield prisma_1.default.shop.update({
        where: { shopId: id },
        data: { isBlackListed: !(previous === null || previous === void 0 ? void 0 : previous.isBlackListed) },
    });
    return result;
});
exports.ShopService = {
    createShop,
    getVendorShop,
    getVendorSingleShop,
    getAllVendorShop,
    getSingleVendorShop,
    blockShop,
};
