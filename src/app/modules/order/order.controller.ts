import { JwtPayload } from "jsonwebtoken";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/tryCatch";
import { OrderService } from "./order.service";
import { pickField } from "../../utils/PickValidField";

const orderProduct = catchAsync(async (req, res) => {
  const result = await OrderService.createOrderIntoDB(
    req.body,
    req.user as JwtPayload & { role: string; userEmail: string }
  );
  sendResponse(res, {
    data: result,
    statusCode: 200,
    success: true,
    message: "Order placed successfully",
  });
});
const getSingleCustomerAllOrder = catchAsync(async (req, res) => {
  const paginationData = pickField(req.query, ["page", "limit", "sort"]);

  const result = await OrderService.getSingleCustomerAllOrder(
    req.user as JwtPayload & { role: string; userEmail: string },
    paginationData
  );

  sendResponse(res, {
    data: result.data,
    meta: result.meta,
    statusCode: 200,
    success: true,
    message: "Orders are fetched successfully",
  });
});

const getSingleOrder = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await OrderService.getSingleOrder(id);

  sendResponse(res, {
    data: result,
    statusCode: 200,
    success: true,
    message: "Orders is fetched successfully",
  });
});

export const OrderController = {
  orderProduct,
  getSingleCustomerAllOrder,
  getSingleOrder,
};
