import bcrypt from "bcrypt";
import prisma from "../../client/prisma";
import { AppError } from "../../Error/AppError";
import { tokenGenerator } from "../../utils/jsonTokenGenerator";

const userLogin = async (data: { email: string; password: string }) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    throw new AppError(404, "Check your email");
  }

  if (!(await bcrypt.compare(data.password, user.password))) {
    throw new AppError(404, "Check your password");
  }

  const token = tokenGenerator({ userEmail: user.email, role: user.role });

  if (!token) {
    throw new AppError(404, "Something Went Wrong!! Try again.");
  }

  return { token };
};

export const AuthService = {
  userLogin,
};
