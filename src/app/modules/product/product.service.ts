import { JwtPayload } from "jsonwebtoken";
import prisma from "../../client/prisma";
import { AppError } from "../../Error/AppError";
import { IProduct, IUpdateProduct } from "./product.interface";
import { paginationHelper } from "../../utils/paginationHelper";
import { IPaginationOptions } from "../../interface/pagination.interface";
import { Prisma } from "@prisma/client";

const addProduct = async (data: IProduct) => {
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

const allProduct = async (
  paginationData: IPaginationOptions,
  params: Record<string, unknown>
) => {
  console.log(params);

  const { page, limit, skip } =
    paginationHelper.calculatePagination(paginationData);

  const { searchTerm, ...filterData } = params;
  let andCondtion: Prisma.ProductWhereInput[] = [];
  console.log(filterData);
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

  const searchField = ["description", "name"];
  if (params.searchTerm) {
    andCondtion.push({
      OR: searchField.map((field) => ({
        [field]: { contains: params.searchTerm as string, mode: "insensitive" },
      })),
    });
  }
  const whereConditons: Prisma.ProductWhereInput = { AND: andCondtion };
  console.dir(whereConditons, { depth: null });
  const result = await prisma.product.findMany({
    where: whereConditons,
    include: {
      category: true,
      shop: true,
    },
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

  const total = await prisma.product.count({
    where: whereConditons,
  });

  return {
    meta: { page, limit, total, totalPage: Math.ceil(total / limit) },
    data: result,
  };
};

const singleProduct = async (id: string) => {
  const result = await prisma.product.findUniqueOrThrow({
    where: {
      productId: id,
    },
    include: {
      category: true,
      shop: true,
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
  allProduct,
  singleProduct,
};

// const allProduct = async (query: Record<string, unknown>) => {
//   let followedShopIds: string[] = [];

//   // If email is provided, get the followed shop IDs
//   if (!!query?.email) {
//     const user = await prisma.customer.findUnique({
//       where: {
//         email: query.email as string,
//       },
//     });

//     if (user?.customerId) {
//       const followedShops = await prisma.follower.findMany({
//         where: { customerId: user.customerId },
//         select: { shopId: true },
//       });

//       followedShopIds = followedShops.map((shop) => shop.shopId);
//     }
//   }

//   // First, fetch products from followed shops
//   const followedProducts = await prisma.product.findMany({
//     where: {
//       shopId: { in: followedShopIds },
//     },
//     include: {
//       category: true,
//       shop: true,
//     },
//     orderBy: {
//       createdAt: "desc", // Order by newest products from followed shops
//     },
//   });

//   // Second, fetch products from other shops
//   const otherProducts = await prisma.product.findMany({
//     where: {
//       shopId: { notIn: followedShopIds },
//     },
//     include: {
//       category: true,
//       shop: true,
//     },
//     orderBy: {
//       createdAt: "desc", // Order by newest products from other shops
//     },
//   });

//   // Combine the results, followed products first, then others
//   const allProducts = [...followedProducts, ...otherProducts];

//   return allProducts;
// };
