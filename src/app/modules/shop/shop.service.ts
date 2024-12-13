import { JwtPayload } from "jsonwebtoken";
import prisma from "../../client/prisma";
import { AppError } from "../../Error/AppError";
import { IPaginationOptions } from "../../interface/pagination.interface";
import { paginationHelper } from "../../utils/paginationHelper";
import { Prisma } from "@prisma/client";

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
const getAllVendorShop = async (
  paginationData: IPaginationOptions,
  params: Record<string, unknown>
) => {
  const { page, limit, skip } =
    paginationHelper.calculatePagination(paginationData);

  const andCondtion: Prisma.ShopWhereInput[] = [];
  const searchField = ["name"];
  if (params.searchTerm) {
    andCondtion.push({
      OR: searchField.map((field) => ({
        [field]: { contains: params.searchTerm as string, mode: "insensitive" },
      })),
    });
  }

  andCondtion.push({ isBlackListed: false });
  const whereConditons: Prisma.ShopWhereInput = { AND: andCondtion };

  const result = await prisma.shop.findMany({
    where: whereConditons,
    include: { vendor: true, followers: true },
    skip: skip,
    take: limit,
    orderBy: paginationData?.sort
      ? {
          [paginationData.sort.split("-")[0]]:
            paginationData.sort.split("-")[1],
        }
      : {
          createdAt: "desc",
        },
  });
  const total = await prisma.shop.count();

  return {
    meta: { page, limit, total, totalPage: Math.ceil(total / limit) },
    data: result,
  };
};

const getSingleVendorShop = async (
  id: string,
  paginationData: IPaginationOptions
) => {
  const { page, limit, skip } =
    paginationHelper.calculatePagination(paginationData);

  //let andCondtion: Prisma.ShopWhereInput[] = [];

  // const searchField = ["description", "name"];
  // if (params.searchTerm) {
  //   andCondtion.push({
  //     OR: searchField.map((field) => ({
  //       [field]: { contains: params.searchTerm as string, mode: "insensitive" },
  //     })),
  //   });
  // }
  const result = await prisma.shop.findUnique({
    where: {
      shopId: id,
    },
    include: {
      products: {
        include: { category: true },
        skip: skip,
        take: limit,
        orderBy: paginationData?.sort
          ? {
              [paginationData.sort.split("-")[0]]:
                paginationData.sort.split("-")[1],
            }
          : {
              createdAt: "desc",
            },
      },
      followers: { include: { customer: { select: { email: true } } } },
    },
  });

  const total = await prisma.product.count({
    where: { shopId: id },
  });

  return {
    result,
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
  };
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

const getVendorSingleShop = async (
  user: JwtPayload,
  id: string,
  paginationData: IPaginationOptions
) => {
  const { page, limit, skip } =
    paginationHelper.calculatePagination(paginationData);

  const data = await prisma.vendor.findUniqueOrThrow({
    where: { email: user?.userEmail },
  });
  const result = await prisma.shop.findFirst({
    where: { shopId: id, vendorId: data.vendorId },
    include: {
      products: {
        include: { category: true },
        skip: skip,
        take: limit,
        orderBy: paginationData?.sort
          ? {
              [paginationData.sort.split("-")[0]]:
                paginationData.sort.split("-")[1],
            }
          : {
              createdAt: "desc",
            },
      },
    },
  });
  const total = await prisma.product.count({
    where: { shopId: id },
  });

  return {
    result,
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
  };
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
