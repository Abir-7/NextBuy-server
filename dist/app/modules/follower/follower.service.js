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
exports.FollowerService = void 0;
const prisma_1 = __importDefault(require("../../client/prisma"));
const AppError_1 = require("../../Error/AppError");
const followShop = (id, user) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.customer.findUnique({
        where: { email: user.userEmail },
    });
    if (!userData) {
        throw new AppError_1.AppError(404, "Shop not listed to follow list.Try again.");
    }
    const result = yield prisma_1.default.follower.create({
        data: { customerId: userData === null || userData === void 0 ? void 0 : userData.customerId, shopId: id },
    });
    return result;
});
const unfollowShop = (id, user) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.customer.findUnique({
        where: { email: user.userEmail },
    });
    if (!userData) {
        throw new AppError_1.AppError(404, "Shop not listed to follow list.Try again.");
    }
    const result = yield prisma_1.default.follower.delete({
        where: {
            shopId_customerId: {
                customerId: userData.customerId,
                shopId: id,
            },
        },
    });
    return result;
});
exports.FollowerService = {
    unfollowShop,
    followShop,
};
