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
exports.ProductService = void 0;
const prisma_1 = __importDefault(require("../../client/prisma"));
const paginationHelper_1 = require("../../utils/paginationHelper");
const addProduct = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.product.create({
        data: Object.assign(Object.assign({}, data), { price: Number(data.price), stock: Number(data.stock), discounts: Number(data.discounts) }),
    });
    return result;
});
const allProduct = (paginationData, params) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(paginationData);
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    let andCondtion = [];
    if (Object.keys(filterData).length > 0) {
        andCondtion.push({
            AND: Object.keys(filterData)
                .filter((field) => Boolean(filterData[field])) // Exclude all falsy values
                .map((field) => ({
                [field]: {
                    equals: filterData[field],
                    // mode: "insensitive", // Uncomment if needed for case-insensitive search
                },
            })),
        });
    }
    const searchField = ["description", "name"];
    if (params.searchTerm) {
        andCondtion.push({
            OR: searchField.map((field) => ({
                [field]: { contains: params.searchTerm, mode: "insensitive" },
            })),
        });
    }
    const whereConditons = { AND: andCondtion };
    const result = yield prisma_1.default.product.findMany({
        where: whereConditons,
        include: {
            category: true,
            shop: true,
            flashSale: true,
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
    const total = yield prisma_1.default.product.count({
        where: whereConditons,
    });
    return {
        meta: { page, limit, total, totalPage: Math.ceil(total / limit) },
        data: result,
    };
});
const singleProduct = (id) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(id);
    const result = yield prisma_1.default.product.findUnique({
        where: {
            productId: id,
        },
        include: {
            category: true,
            shop: true,
            flashSale: true,
        },
    });
    return result;
});
const updateProduct = (data, id, user) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.vendor.findUniqueOrThrow({
        where: { email: user.userEmail },
    });
    const result = yield prisma_1.default.product.update({
        where: { productId: id },
        data: Object.assign({}, data),
    });
    return result;
});
const deleteProduct = (id, user) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.vendor.findUniqueOrThrow({
        where: { email: user.userEmail },
    });
    const result = yield prisma_1.default.product.delete({
        where: { productId: id },
    });
    return result;
});
const flashProduct = () => __awaiter(void 0, void 0, void 0, function* () {
    // Check if there's any active flash sale data
    const existingFlashSale = yield prisma_1.default.flashSale.findFirst({
        where: { endAt: { gte: new Date() } },
    });
    if (!existingFlashSale) {
        // Delete old flash sale data
        yield prisma_1.default.flashSale.deleteMany();
        // Fetch a larger number of products to randomize
        const allProducts = yield prisma_1.default.product.findMany({
            where: { stock: { gt: 0 } },
            select: { productId: true }, // Fetch only necessary fields
        });
        // Shuffle the array to pick random products
        const shuffledProducts = allProducts.sort(() => 0.5 - Math.random());
        // Select up to 10 random products
        const selectedProducts = shuffledProducts.slice(0, 30);
        // Prepare flash sale data
        const flashSaleData = selectedProducts.map((product) => ({
            productId: product.productId,
            discount: Math.floor(Math.random() * (25 - 15 + 1)) + 15, // Random discount between 15% and 25%
            startAt: new Date(),
            endAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Valid for 24 hours
        }));
        // Insert flash sale data
        yield prisma_1.default.flashSale.createMany({ data: flashSaleData });
        const result = yield prisma_1.default.flashSale.findMany({
            include: { product: { include: { category: true, shop: true } } },
        });
        return result;
    }
    else {
        const result = yield prisma_1.default.flashSale.findMany({
            include: { product: { include: { category: true, shop: true } } },
        });
        return result;
    }
});
exports.ProductService = {
    addProduct,
    updateProduct,
    deleteProduct,
    allProduct,
    singleProduct,
    flashProduct,
};
