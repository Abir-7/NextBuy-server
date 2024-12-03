import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/tryCatch";
import { CategoryService } from "./category.service";

const createCategory = catchAsync(async (req, res) => {
  const result = await CategoryService.createCategory(req.body);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Category Created Successfully",
    data: result,
  });
});
export const CategoryController = {
  createCategory,
};