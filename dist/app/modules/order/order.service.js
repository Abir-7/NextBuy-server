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
exports.OrderService = void 0;
const prisma_1 = __importDefault(require("../../client/prisma"));
const AppError_1 = require("../../Error/AppError");
const payment_utils_1 = require("./payment/payment.utils");
const uuid_1 = require("uuid");
const paginationHelper_1 = require("../../utils/paginationHelper");
const createOrderIntoDB = (orderInfo, userData) => __awaiter(void 0, void 0, void 0, function* () {
    const customerData = yield prisma_1.default.customer.findUnique({
        where: { email: userData.userEmail },
    });
    if (!customerData) {
        throw new AppError_1.AppError(404, "Faild payment");
    }
    const txn = (0, uuid_1.v4)();
    const orderData = yield prisma_1.default.order.create({
        data: {
            couponId: orderInfo.couponId,
            subTotal: orderInfo.subTotal,
            total: orderInfo.total,
            discounts: orderInfo.discounts,
            customerId: customerData.customerId,
            transactionId: txn,
            paymentStatus: "PENDING",
            items: {
                create: orderInfo.items.map((item) => ({
                    shopId: item.shopId,
                    productId: item.productId,
                    size: item.size,
                    quantity: item.quantity,
                    price: item.price,
                    discount: item.discount,
                })),
            },
        },
    });
    const paymentInfo = yield (0, payment_utils_1.initiatePayment)({
        orderData: orderData.subTotal,
        txn,
        customerData,
        orderId: orderData.id,
    });
    return Object.assign(Object.assign({}, orderData), { payLink: paymentInfo.data.payment_url });
});
const getSingleCustomerAllOrder = (userInfo, paginationData, params) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(paginationData);
    const userData = yield prisma_1.default.customer.findUnique({
        where: {
            email: userInfo.userEmail,
        },
    });
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
    andCondtion.push({ AND: [{ customerId: userData === null || userData === void 0 ? void 0 : userData.customerId }] });
    const whereConditons = { AND: andCondtion };
    const result = yield prisma_1.default.order.findMany({
        where: whereConditons,
        include: { items: { include: { product: true } } },
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
    const total = yield prisma_1.default.order.count();
    return {
        meta: { page, limit, total, totalPage: Math.ceil(total / limit) },
        data: result,
    };
});
const getSingleOrder = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.order.findUniqueOrThrow({
        where: {
            id,
        },
        include: { items: { include: { product: true, shop: true } } },
    });
    return result;
});
const getAllOrder = (paginationData) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(paginationData);
    const result = yield prisma_1.default.order.findMany({
        include: {
            items: { include: { product: true, shop: true } },
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
    const total = yield prisma_1.default.order.count();
    return {
        meta: { page, limit, total, totalPage: Math.ceil(total / limit) },
        data: result,
    };
});
const getPendingOrder = (paginationData) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(paginationData);
    const result = yield prisma_1.default.order.findMany({
        where: { status: { not: "DELIVERED" } },
        include: {
            items: { include: { product: true, shop: true } },
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
    const total = yield prisma_1.default.order.count({
        where: { status: { not: "DELIVERED" } },
    });
    return {
        meta: { page, limit, total, totalPage: Math.ceil(total / limit) },
        data: result,
    };
});
const updateOrder = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // Fetch the current order status
    const order = yield prisma_1.default.order.findUnique({ where: { id } });
    if (!order) {
        throw new Error(`Order with ID ${id} not found`);
    }
    // Define the status transition sequence
    const statusSequence = {
        PENDING: "ONGOING",
        ONGOING: "DELIVERED",
        DELIVERED: "DELIVERED", // No further transitions from 'delivered'
    };
    // Get the next status based on the current status
    const currentStatus = order.status;
    const nextStatus = statusSequence[currentStatus];
    if (!nextStatus) {
        throw new Error(`Invalid current status: ${currentStatus}`);
    }
    // Update the order status to the next status
    const result = yield prisma_1.default.order.update({
        where: { id },
        data: {
            status: nextStatus,
        },
    });
    return result;
});
const getSpecificShopOrder = (userData, paginationData, params) => __awaiter(void 0, void 0, void 0, function* () {
    const vendor = yield prisma_1.default.vendor.findUniqueOrThrow({
        where: { email: userData.userEmail },
    });
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
    andCondtion.push({
        AND: [
            {
                items: {
                    some: {
                        shop: { vendorId: vendor.vendorId }, // Replace 'your-shop-id' with the desired shop ID
                    },
                },
            },
        ],
    });
    console.dir(andCondtion, { depth: null });
    const whereConditons = { AND: andCondtion };
    const orders = yield prisma_1.default.order.findMany({
        where: whereConditons,
        include: {
            items: { include: { product: true } }, // Include order items if needed
            customer: true, // Include customer details if needed
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
    console.log(skip);
    const total = yield prisma_1.default.order.count({
        where: whereConditons,
    });
    return {
        meta: { page, limit, total, totalPage: Math.ceil(total / limit) },
        data: orders,
    };
});
exports.OrderService = {
    createOrderIntoDB,
    getSingleCustomerAllOrder,
    getSingleOrder,
    getAllOrder,
    updateOrder,
    getPendingOrder,
    getSpecificShopOrder,
};
