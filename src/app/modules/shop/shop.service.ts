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

  const result = await prisma.shop.create({
    data: { ...data, vendorId: userData.vendorId },
  });
  return result;
};
// for all
const getAllVendorShop = async () => {
  const result = await prisma.shop.findMany({ include: { vendor: true } });

  return result;
};

const getSingleVendorShop = async (id: string) => {
  const result = await prisma.shop.findUnique({
    where: {
      shopId: id,
    },
    include: {
      products: { include: { category: true } },
      followers: { include: { customer: { select: { email: true } } } },
    },
  });

  return result;
};

//for vendor
const getVendorShop = async (user: JwtPayload) => {
  const userData = await prisma.vendor.findUnique({
    where: { email: user?.userEmail },
  });

  const result = await prisma.shop.findMany({
    where: { vendorId: userData?.vendorId },
  });

  return result;
};

const getVendorSingleShop = async (user: JwtPayload, id: string) => {
  const data = await prisma.vendor.findUniqueOrThrow({
    where: { email: user?.userEmail },
  });
  const result = await prisma.shop.findFirst({
    where: { shopId: id, vendorId: data.vendorId },
    include: { products: { include: { category: true } } },
  });

  return result;
};

const blockShop = async (id: string) => {
  const previous = await prisma.shop.findUnique({
    where: {
      shopId: id,
    },
  });
  const result = await prisma.shop.update({
    where: { shopId: id },
    data: { isBlackListed: !previous?.isBlackListed },
  });
  return result;
};

export const ShopService = {
  createShop,
  getVendorShop,
  getVendorSingleShop,
  getAllVendorShop,
  getSingleVendorShop,
  blockShop,
};
