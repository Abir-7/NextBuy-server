import prisma from "../../client/prisma";

const createShop = async (data: {
  name: string;
  location: string;
  vendorId: string;
}) => {
  const result = await prisma.shop.create({ data: data });
  return result;
};
export const ShopService = {
  createShop,
};
