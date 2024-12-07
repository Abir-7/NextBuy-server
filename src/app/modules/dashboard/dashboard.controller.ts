import { JwtPayload } from "jsonwebtoken";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/tryCatch";
import { DashboardService } from "./dashboard.service";

const getUserDashboard = catchAsync(async (req, res) => {
  const userData = req.user as JwtPayload & { userEmail: string; role: string };
  const result = await DashboardService.getUserDashboard(userData);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Dashboard data fetch successfully",
    data: result,
  });
});

const getAdminDashboard = catchAsync(async (req, res) => {
  console.log("ggg");

  const result = await DashboardService.getAdminDashboard();

  console.log(result);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Dashboard data fetch successfully",
    data: result,
  });
});

const getVendorDashboard = catchAsync(async (req, res) => {
  const userData = req.user as JwtPayload & { userEmail: string; role: string };
  const result = await DashboardService.getVendorDashboard(userData);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Dashboard data fetch successfully",
    data: result,
  });
});

export const DashboardController = {
  getUserDashboard,
  getAdminDashboard,
  getVendorDashboard,
};
