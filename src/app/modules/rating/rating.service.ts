import { JwtPayload } from "jsonwebtoken";
import prisma from "../../client/prisma";
import { IReview } from "./rating.interface";
import { AppError } from "../../Error/AppError";
import { IPaginationOptions } from "../../interface/pagination.interface";
import { paginationHelper } from "../../utils/paginationHelper";

const addRating = async (
  data: IReview,
  userData: JwtPayload & { userEmail: string; role: string }
) => {
  const cId = await prisma.customer.findUnique({
    where: { email: userData.userEmail },
  });

  if (!cId) {
    throw new AppError(404, "Cant Add Review");
  }

  const result = await prisma.review.create({
    data: { ...data, customerId: cId?.customerId },
  });
  return result;
};

const getUserReviewByShop = async (
  userData: JwtPayload & { userEmail: string; role: string },
  paginationData: IPaginationOptions
) => {
  const { page, limit, skip } =
    paginationHelper.calculatePagination(paginationData);
  const result = await prisma.review.findMany({
    where: {
      orderItem: {
        shop: { vendor: { email: userData.userEmail } },
      },
    },
    include: {
      customer: { select: { customerId: true, email: true, name: true } },
      product: { select: { name: true, productId: true, images: true } },
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
  console.log(skip);
  const total = await prisma.review.count({
    where: {
      orderItem: {
        shop: { vendor: { email: userData.userEmail } },
      },
    },
  });

  return {
    meta: { page, limit, total, totalPage: Math.ceil(total / limit) },
    data: result,
  };
};

const replyToReview = async (data: { id: string; vendorReply: string }) => {
  // Fetch the existing review
  const existingReview = await prisma.review.findUnique({
    where: {
      reviewId: data.id,
    },
    select: {
      vendorReply: true,
    },
  });

  // Check if the vendorReply is already populated
  if (existingReview?.vendorReply) {
    throw new Error("Vendor reply already exists. Update not allowed.");
  }

  // Update only if vendorReply is empty
  const result = await prisma.review.update({
    where: {
      reviewId: data.id,
    },
    data: {
      vendorReply: data.vendorReply,
    },
  });

  return result;
};

export const RatingService = {
  addRating,
  getUserReviewByShop,
  replyToReview,
};
