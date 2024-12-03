import { JwtPayload } from "jsonwebtoken";
import prisma from "../../client/prisma";
import { AppError } from "../../Error/AppError";
import { IProduct } from "./product.interface";

const addProduct = async (data: IProduct) => {
  console.dir(data, { depth: true });
  const result = await prisma.product.create({
    data: {
      ...data,
      price: Number(data.price),
      stock: Number(data.stock),
      discounts: Number(data.discounts),
    },
  });

  return result;
};

const getVendorShop = async (user: JwtPayload) => {
  const userData = await prisma.vendor.findUnique({
    where: { email: user?.userEmail },
  });

  const result = await prisma.shop.findMany({
    where: { vendorId: userData?.vendorId },
  });

  return result;
};

export const ProductService = {
  addProduct,
  getVendorShop,
};
