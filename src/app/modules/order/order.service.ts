import { JwtPayload } from "jsonwebtoken";
import prisma from "../../client/prisma";
import { AppError } from "../../Error/AppError";
import { initiatePayment } from "./payment/payment.utils";
import { IOrderRequest } from "./order.interface";
import { v4 as uuidv4 } from "uuid";
import { IPaginationOptions } from "../../interface/pagination.interface";
import { paginationHelper } from "../../utils/paginationHelper";
const createOrderIntoDB = async (
  orderInfo: IOrderRequest,
  userData: JwtPayload & { role: string; userEmail: string }
) => {
  const customerData = await prisma.customer.findUnique({
    where: { email: userData.userEmail },
  });

  if (!customerData) {
    throw new AppError(404, "Faild payment");
  }

  const txn = uuidv4();

  const orderData = await prisma.order.create({
    data: {
      subTotal: orderInfo.subTotal,
      total: orderInfo.total,
      discounts: orderInfo.discounts,
      customerId: customerData.customerId,
      transactionId: txn,
      paymentStatus: "PENDING",
      items: {
        create: orderInfo.items.map((item) => ({
          shopId: item.shopId,
          productId: item.productId,
          size: item.size,
          quantity: item.quantity,
          price: item.price,
          discount: item.discount,
        })),
      },
    },
  });

  const paymentInfo = await initiatePayment({
    orderData: orderData.subTotal,
    txn,
    customerData,
    orderId: orderData.id,
  });

  return { ...orderData, payLink: paymentInfo.data.payment_url };
};

const getSingleCustomerAllOrder = async (
  userInfo: JwtPayload & { userEmail: string; role: string },
  paginationData: IPaginationOptions
) => {
  const { page, limit, skip } =
    paginationHelper.calculatePagination(paginationData);

  const userData = await prisma.customer.findUnique({
    where: {
      email: userInfo.userEmail,
    },
  });
  const result = await prisma.order.findMany({
    where: {
      customerId: userData?.customerId,
    },
    include: { items: { include: { product: true } } },
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

  const total = await prisma.order.count();

  return {
    meta: { page, limit, total, totalPage: Math.ceil(total / limit) },
    data: result,
  };
};

const getSingleOrder = async (id: string) => {
  const result = await prisma.order.findUniqueOrThrow({
    where: {
      id,
    },
    include: { items: { include: { product: true, shop: true } } },
  });

  return result;
};

export const OrderService = {
  createOrderIntoDB,
  getSingleCustomerAllOrder,
  getSingleOrder,
};
