import { JwtPayload } from "jsonwebtoken";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/tryCatch";
import { ProductService } from "./product.service";

const addProduct = catchAsync(async (req, res) => {
  const result = await ProductService.addProduct(req.body);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Product added Successfully",
    data: result,
  });
});

const updateProduct = catchAsync(async (req, res) => {
  const { id } = req.params;
  const user = req.user as JwtPayload & { userEmail: string; role: string };
  const result = await ProductService.updateProduct(req.body, id, user);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Product updated Successfully",
    data: result,
  });
});

const deleteProduct = catchAsync(async (req, res) => {
  const { id } = req.params;
  const user = req.user as JwtPayload & { userEmail: string; role: string };
  const result = await ProductService.deleteProduct(id, user);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Product deleted Successfully",
    data: result,
  });
});

export const ProductController = {
  addProduct,
  updateProduct,
  deleteProduct,
};
