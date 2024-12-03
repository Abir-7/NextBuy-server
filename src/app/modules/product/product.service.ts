import { JwtPayload } from "jsonwebtoken";
import prisma from "../../client/prisma";
import { AppError } from "../../Error/AppError";
import { IProduct, IUpdateProduct } from "./product.interface";

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

const updateProduct = async (
  data: Partial<IUpdateProduct>,
  id: string,
  user: JwtPayload & { userEmail: string; role: string }
) => {
  await prisma.vendor.findUniqueOrThrow({
    where: { email: user.userEmail },
  });
  console.dir(data, { depth: true });
  const result = await prisma.product.update({
    where: { productId: id },
    data: {
      ...data,
    },
  });

  return result;
};

const deleteProduct = async (
  id: string,
  user: JwtPayload & { userEmail: string; role: string }
) => {
  await prisma.vendor.findUniqueOrThrow({
    where: { email: user.userEmail },
  });

  const result = await prisma.product.delete({
    where: { productId: id },
  });

  return result;
};

export const ProductService = {
  addProduct,
  updateProduct,
  deleteProduct,
};
