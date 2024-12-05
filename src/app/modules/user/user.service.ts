import prisma from "../../client/prisma";
import bcrypt from "bcrypt";
import { config } from "../../config";
import { tokenGenerator } from "../../utils/jsonTokenGenerator";
import { IPaginationOptions } from "../../interface/pagination.interface";
import { paginationHelper } from "../../utils/paginationHelper";
import { Prisma } from "@prisma/client";
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

const getAllUser = async (
  paginationData: IPaginationOptions,
  params: Record<string, unknown>
) => {
  const { page, limit, skip } =
    paginationHelper.calculatePagination(paginationData);
  const { searchTerm, ...filterData } = params;
  let andCondtion: Prisma.UserWhereInput[] = [];

  if (Object.keys(filterData).length > 0) {
    andCondtion.push({
      AND: Object.keys(filterData)
        .filter((field) => Boolean(filterData[field])) // Exclude all falsy values
        .map((field) => {
          const value =
            filterData[field] === "true"
              ? true
              : filterData[field] === "false"
              ? false
              : filterData[field];

          return {
            [field]: {
              equals: value,
              // mode: "insensitive", // Uncomment if needed for case-insensitive search
            },
          };
        }),
    });
  }

  const searchField = ["email"];
  if (params.searchTerm) {
    andCondtion.push({
      OR: searchField.map((field) => ({
        [field]: { contains: params.searchTerm as string, mode: "insensitive" },
      })),
    });
  }
  const whereConditons: Prisma.UserWhereInput = { AND: andCondtion };

  andCondtion.push({
    AND: [{ isDeleted: false }, { role: { not: "SUPERADMIN" } }],
  });

  const result = await prisma.user.findMany({
    where: whereConditons,
    select: {
      userId: true,
      email: true,
      role: true,
      isBlocked: true,
      Admin: true,
      vendor: true,
      customer: true,
    },
  });

  return result;
};

const userBlock = async (id: string) => {
  const previous = await prisma.user.findUnique({
    where: {
      userId: id,
    },
  });
  const result = await prisma.user.update({
    where: { userId: id },
    data: { isBlocked: !previous?.isBlocked },
    select: { isBlocked: true },
  });

  return result;
};

const userDelete = async (id: string) => {
  const previous = await prisma.user.findUnique({
    where: {
      userId: id,
    },
  });
  const result = await prisma.user.update({
    where: { userId: id },
    data: { isDeleted: !previous?.isDeleted },
    select: { isDeleted: true },
  });

  return result;
};

export const UserService = {
  createUser,
  getAllUser,
  userBlock,
  userDelete,
};
