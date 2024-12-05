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
const getSingleCustomerAllOrder = (userInfo, paginationData) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(paginationData);
    const userData = yield prisma_1.default.customer.findUnique({
        where: {
            email: userInfo.userEmail,
        },
    });
    const result = yield prisma_1.default.order.findMany({
        where: {
            customerId: userData === null || userData === void 0 ? void 0 : userData.customerId,
        },
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
    console.dir(result, { depth: null });
    return result;
});
exports.OrderService = {
    createOrderIntoDB,
    getSingleCustomerAllOrder,
    getSingleOrder,
};
