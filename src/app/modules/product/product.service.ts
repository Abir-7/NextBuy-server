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
  const { page, limit, skip } =
    paginationHelper.calculatePagination(paginationData);

  const { searchTerm, ...filterData } = params;
  let andCondtion: Prisma.ProductWhereInput[] = [];
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

  const result = await prisma.product.findMany({
    where: whereConditons,
    include: {
      category: true,
      shop: true,
      flashSale: true,
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
  const result = await prisma.product.findUnique({
    where: {
      productId: id,
    },
    include: {
      category: true,
      shop: true,
      flashSale: true,
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

const flashProduct = async () => {
  // Check if there's any active flash sale data
  const existingFlashSale = await prisma.flashSale.findFirst({
    where: { endAt: { gte: new Date() } },
  });

  if (!existingFlashSale) {
    // Delete old flash sale data
    await prisma.flashSale.deleteMany();

    // Fetch a larger number of products to randomize
    const allProducts = await prisma.product.findMany({
      where: { stock: { gt: 0 } },
      select: { productId: true }, // Fetch only necessary fields
    });

    // Shuffle the array to pick random products
    const shuffledProducts = allProducts.sort(() => 0.5 - Math.random());

    // Select up to 10 random products
    const selectedProducts = shuffledProducts.slice(0, 30);

    // Prepare flash sale data
    const flashSaleData = selectedProducts.map((product) => ({
      productId: product.productId,
      discount: Math.floor(Math.random() * (25 - 15 + 1)) + 15, // Random discount between 15% and 25%
      startAt: new Date(),
      endAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Valid for 24 hours
    }));

    // Insert flash sale data
    await prisma.flashSale.createMany({ data: flashSaleData });

    const result = await prisma.flashSale.findMany({
      include: { product: { include: { category: true, shop: true } } },
    });
    return result;
  } else {
    const result = await prisma.flashSale.findMany({
      include: { product: { include: { category: true, shop: true } } },
    });
    return result;
  }
};

export const ProductService = {
  addProduct,
  updateProduct,
  deleteProduct,
  allProduct,
  singleProduct,
  flashProduct,
};
