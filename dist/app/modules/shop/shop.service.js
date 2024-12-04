"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopService = void 0;
const prisma_1 = __importDefault(require("../../client/prisma"));
const AppError_1 = require("../../Error/AppError");
const createShop = (data, user) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.vendor.findUnique({
      where: {
        email: user === null || user === void 0 ? void 0 : user.userEmail,
      },
    });
    if (!userData) {
      throw new AppError_1.AppError(
        404,
        "Failed to create Shop. User not found."
      );
    }

    const result = yield prisma_1.default.shop.create({
      data: Object.assign(Object.assign({}, data), {
        vendorId: userData.vendorId,
      }),
    });
    return result;
  });
// for all
const getAllVendorShop = () =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.shop.findMany();
    return result;
  });
const getSingleVendorShop = (id) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.shop.findUnique({
      where: {
        shopId: id,
      },
      include: { products: { include: { category: true } } },
    });
    return result;
  });
//for vendor
const getVendorShop = (user) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.vendor.findUnique({
      where: {
        email: user === null || user === void 0 ? void 0 : user.userEmail,
      },
    });
    const result = yield prisma_1.default.shop.findMany({
      where: {
        vendorId:
          userData === null || userData === void 0 ? void 0 : userData.vendorId,
      },
    });
    return result;
  });
const getVendorSingleShop = (user, id) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const data = yield prisma_1.default.vendor.findUniqueOrThrow({
      where: {
        email: user === null || user === void 0 ? void 0 : user.userEmail,
      },
    });
    const result = yield prisma_1.default.shop.findFirst({
      where: { shopId: id, vendorId: data.vendorId },
      include: { products: { include: { category: true } } },
    });

    return result;
  });
exports.ShopService = {
  createShop,
  getVendorShop,
  getVendorSingleShop,
  getAllVendorShop,
  getSingleVendorShop,
};
