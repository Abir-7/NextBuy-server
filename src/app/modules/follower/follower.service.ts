import { JwtPayload } from "jsonwebtoken";
import prisma from "../../client/prisma";
import { AppError } from "../../Error/AppError";

const followShop = async (
  id: string,
  user: JwtPayload & { userEmail: string; role: string }
) => {
  const userData = await prisma.customer.findUnique({
    where: { email: user.userEmail },
  });
  if (!userData) {
    throw new AppError(404, "Shop not listed to follow list.Try again.");
  }

  const result = await prisma.follower.create({
    data: { customerId: userData?.customerId, shopId: id },
  });

  return result;
};

const unfollowShop = async (
  id: string,
  user: JwtPayload & { userEmail: string; role: string }
) => {
  const userData = await prisma.customer.findUnique({
    where: { email: user.userEmail },
  });
  if (!userData) {
    throw new AppError(404, "Shop not listed to follow list.Try again.");
  }
  const result = await prisma.follower.delete({
    where: {
      shopId_customerId: {
        customerId: userData.customerId,
        shopId: id,
      },
    },
  });

  return result;
};

export const FollowerService = {
  unfollowShop,
  followShop,
};
