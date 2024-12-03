import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/tryCatch";
import { ProductService } from "./product.service";

const addProduct = catchAsync(async (req, res) => {
  const result = await ProductService.addProduct(req.body);
  console.log(result, "gggg");
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Product added Successfully",
    data: result,
  });
});

// const getVendorShop = catchAsync(async (req, res) => {
//   const result = await ShopService.getVendorShop(req.user);
//   console.log("object");
//   sendResponse(res, {
//     success: true,
//     statusCode: 200,
//     message: "Shop is fetched Successfully",
//     data: result,
//   });
// });

export const ProductController = {
  addProduct,
  //getVendorShop,
};
