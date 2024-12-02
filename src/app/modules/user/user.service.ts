import prisma from "../../client/prisma";
import bcrypt from "bcrypt";
import { config } from "../../config";
const createUser = async (data: ICreateUser) => {
  console.log(data);

  const { address, email, password, mobile, name } = data;

  const hashedPass = await bcrypt.hash(
    password,
    Number(config.saltRounds as string)
  );

  const result = await prisma.$transaction(async (prisma) => {
    const user = await prisma.user.create({
      data: {
        email: email,
        password: hashedPass,
      },
    });

    await prisma.customer.create({
      data: {
        email: user.email,
        name,
        mobile: Number(mobile),
        address,
        userId: user.userId,
      },
    });
    const result = await prisma.customer.findUnique({
      where: { email: user.email },
    });
    return result;
  });

  return result;
};
export const UserService = {
  createUser,
};
