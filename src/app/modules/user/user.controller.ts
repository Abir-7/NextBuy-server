import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/tryCatch";
import { UserService } from "./user.service";

const createUser = catchAsync(async (req, res) => {
  const result = await UserService.createUser(req.body);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User Created Successfully",
    data: result,
  });
});
export const UserController = {
  createUser,
};
