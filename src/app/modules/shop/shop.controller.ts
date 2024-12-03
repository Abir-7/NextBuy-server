import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/tryCatch";
import { ShopService } from "./shop.service";

const createShop = catchAsync(async (req, res) => {
  const result = await ShopService.createShop(req.body, req.user);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Shop Created Successfully",
    data: result,
  });
});

const getVendorShop = catchAsync(async (req, res) => {
  const result = await ShopService.getVendorShop(req.user);
  console.log("object");
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Shop are fetched Successfully",
    data: result,
  });
});
const getVendorSingleShop = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ShopService.getVendorSingleShop(req.user, id);
  console.log("object");
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Shop data is fetched Successfully",
    data: result,
  });
});

export const ShopController = {
  createShop,
  getVendorShop,
  getVendorSingleShop,
};
