import bcrypt from "bcrypt";
import prisma from "../../client/prisma";
import { AppError } from "../../Error/AppError";
import { tokenGenerator } from "../../utils/jsonTokenGenerator";
import { sendMail } from "../../utils/nodeMailer";
import { JwtPayload } from "jsonwebtoken";

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

  if (user.isBlocked) {
    throw new AppError(404, "User blocked");
  }
  if (user.isDeleted) {
    throw new AppError(404, "User deleted");
  }

  const token = tokenGenerator({ userEmail: user.email, role: user.role });

  if (!token) {
    throw new AppError(404, "Something Went Wrong!! Try again.");
  }

  return { token };
};

const userResetPassLinkGenarator = async (userEmail: string) => {
  const findUser = await prisma.user.findUnique({
    where: { email: userEmail },
  });
  if (!findUser) {
    throw new AppError(500, "User not found");
  }

  const accessToken = tokenGenerator(
    {
      userEmail: userEmail,
      role: "",
    },
    "5min"
  );
  // { to, subject, text, html }
  await sendMail({
    to: userEmail,
    subject: "Reset pass link",
    text: "Change your pass within 5min",
    html: `<a href="http://localhost:3000/reset-password?email=${userEmail}&token=${accessToken}">Reset Link</a>
  <p>Change your pass within 5min</p>`,
  });

  return "";
};

export const AuthService = {
  userLogin,
  userResetPassLinkGenarator,
};
