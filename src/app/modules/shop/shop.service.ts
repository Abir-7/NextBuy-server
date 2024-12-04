import { JwtPayload } from "jsonwebtoken";
import prisma from "../../client/prisma";
import { AppError } from "../../Error/AppError";

const createShop = async (
  data: {
    name: string;
    location: string;
  },
  user: JwtPayload
) => {
  const userData = await prisma.vendor.findUnique({
    where: { email: user?.userEmail },
  });

  if (!userData) {
    throw new AppError(404, "Failed to create Shop. User not found.");
  }

  console.log(data);

  const result = await prisma.shop.create({
    data: { ...data, vendorId: userData.vendorId },
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
  console.dir(result, { depth: null });
  return result;
};

const getVendorSingleShop = async (user: JwtPayload, id: string) => {
  await prisma.vendor.findUniqueOrThrow({
    where: { email: user?.userEmail },
  });
  const result = await prisma.shop.findFirst({
    where: { shopId: id },
    include: { products: { include: { category: true } } },
  });

  console.dir(result, { depth: null });
  return result;
};

export const ShopService = {
  createShop,
  getVendorShop,
  getVendorSingleShop,
};
