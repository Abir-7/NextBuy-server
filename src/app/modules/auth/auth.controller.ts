import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/tryCatch";
import { AuthService } from "./auth.service";

const userLogin = catchAsync(async (req, res) => {
  const result = await AuthService.userLogin(req.body);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Welcome Back.",
    data: result,
  });
});

export const AuthController = {
  userLogin,
};
