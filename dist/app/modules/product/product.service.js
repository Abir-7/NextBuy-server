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
exports.ProductService = void 0;
const prisma_1 = __importDefault(require("../../client/prisma"));
const addProduct = (data) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.product.create({
      data: Object.assign(Object.assign({}, data), {
        price: Number(data.price),
        stock: Number(data.stock),
        discounts: Number(data.discounts),
      }),
    });
    return result;
  });
const allProduct = () =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.product.findMany({
      include: {
        category: true,
        shop: true,
      },
    });

    return result;
  });
const singleProduct = (id) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.product.findUniqueOrThrow({
      where: {
        productId: id,
      },
      include: {
        category: true,
        shop: true,
      },
    });

    return result;
  });
const updateProduct = (data, id, user) =>
  __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.vendor.findUniqueOrThrow({
      where: { email: user.userEmail },
    });

    const result = yield prisma_1.default.product.update({
      where: { productId: id },
      data: Object.assign({}, data),
    });
    return result;
  });
const deleteProduct = (id, user) =>
  __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.vendor.findUniqueOrThrow({
      where: { email: user.userEmail },
    });
    const result = yield prisma_1.default.product.delete({
      where: { productId: id },
    });
    return result;
  });
exports.ProductService = {
  addProduct,
  updateProduct,
  deleteProduct,
  allProduct,
  singleProduct,
};
