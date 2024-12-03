import prisma from "../../client/prisma";
import bcrypt from "bcrypt";
import { config } from "../../config";
import { tokenGenerator } from "../../utils/jsonTokenGenerator";
const createUser = async (data: ICreateUser) => {
  const { address, email, password, mobile, name, accountType } = data;

  const hashedPass = await bcrypt.hash(
    password,
    Number(config.saltRounds as string)
  );

  const result = await prisma.$transaction(async (prisma) => {
    const user = await prisma.user.create({
      data: {
        email: email,
        password: hashedPass,
        role: accountType,
      },
    });

    if (accountType === "CUSTOMER") {
      await prisma.customer.create({
        data: {
          email: user.email,
          name,
          mobile: Number(mobile),
          address,
          userId: user.userId,
        },
      });
    }

    if (accountType === "VENDOR") {
      await prisma.vendor.create({
        data: {
          email: user.email,
          name,
          mobile: Number(mobile),
          address,
          userId: user.userId,
        },
      });
    }

    await prisma.user.findUnique({
      where: { email: user.email },
    });
    const token = tokenGenerator({ userEmail: user.email, role: user.role });
    return token;
  });

  return result;
};
export const UserService = {
  createUser,
};
