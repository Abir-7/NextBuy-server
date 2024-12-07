import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/tryCatch";
import { CuponService } from "./cupon.service";

const createCupon = catchAsync(async (req, res) => {
  const result = await CuponService.createCupon(req.body);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Cupon created successfully",
    data: result,
  });
});

const getShopCupon = catchAsync(async (req, res) => {
  const result = await CuponService.getShopCupon(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Shop cupon fetch successfully",
    data: result,
  });
});

export const CuponController = {
  createCupon,
  getShopCupon,
};
