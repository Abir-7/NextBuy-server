import { NextFunction, Request, Response } from "express";

import jwt, { JwtPayload } from "jsonwebtoken";

import { config } from "../../config";

import prisma from "../../client/prisma";
import { AppError } from "../../Error/AppError";
import catchAsync from "../../utils/tryCatch";

export type T_UserRole = "CUSTOMER" | "ADMIN" | "VENDOR";
export const auth = (...userRole: T_UserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const tokenData = req.headers.authorization;

    const token = tokenData;

    if (!token) {
      throw new AppError(401, "You have no access to this route1");
    }

    try {
      const decoded = jwt.verify(
        token,
        config.jwt_secrete_key as string
      ) as JwtPayload;
      console.log(decoded, "decoded");
      const { role, userEmail } = decoded as JwtPayload;

      const user = await prisma.user.findUnique({
        where: { email: userEmail },
      });
      //check user exixt or not
      if (!user) {
        throw new AppError(401, "You have no access to this route2", "");
      }

      if (userRole && !userRole.includes(role)) {
        throw new AppError(401, "You have no access to this route3", "");
      }

      req.user = decoded as JwtPayload;
      next();
    } catch (error: any) {
      console.log("hit", error);
      throw new AppError(401, "You have no access to this route");
    }
  });
};