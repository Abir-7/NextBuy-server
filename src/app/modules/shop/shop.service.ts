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
  //console.log(user);

  const userData = await prisma.vendor.findUnique({
    where: { email: user?.userEmail },
  });

  console.log(userData, "gggg");

  if (!userData) {
    throw new AppError(404, "Failed to create Shop. User not found.");
  }

  const result = await prisma.shop.create({
    data: { ...data, vendorId: userData.vendorId },
  });
  return result;
};
export const ShopService = {
  createShop,
};
